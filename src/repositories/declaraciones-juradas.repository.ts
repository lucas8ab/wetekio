import {DefaultCrudRepository, repository, EntityNotFoundError} from '@loopback/repository';
import {DeclaracionesJuradas, DeclaracionesJuradasRelations, Obligacion} from '../models';
import {CassandraBucDataSource} from '../datasources';
import {inject} from '@loopback/core';
import moment = require('moment');
import { v4 as uuid } from 'uuid';
import { ObligacionRepository } from './obligacion.repository';

export class DeclaracionesJuradasRepository extends DefaultCrudRepository<
  DeclaracionesJuradas,
  typeof DeclaracionesJuradas.prototype.id,
  DeclaracionesJuradasRelations
> {
  constructor(
    @inject('datasources.cassandra_buc')
    dataSource: CassandraBucDataSource,
    @repository(ObligacionRepository)
    private obligacionRepository: ObligacionRepository
  ) {
    super(DeclaracionesJuradas, dataSource);
  }

  async createDDJJ(ddjj: any) {
    const fecha = moment(ddjj.periodo.periodo);
    let obligacion = await this.obligacionRepository
    .getBySujetoPeriodoCuota(ddjj.sujeto_id, fecha.year().toString(), (fecha.month() + 1).toString());

    let ddjjStored : any = await this.find({
      where: {
        sujeto_id: ddjj.sujeto_id,
        obligacion_id: obligacion.id,
        objeto_id: obligacion.objeto_id,
        objeto_tipo: obligacion.objeto_tipo
      }
    });

    ddjjStored = ddjjStored.filter((dj: any) => dj.estado != 'inactiva');
    ddjj = await this.formatterDDJJ(ddjj, obligacion, ddjjStored.length > 0 ? 'rectificada' : 'presentada');
    
    let queryCreate = `INSERT INTO buc_declaraciones_juradas (bdj_suj_identificador, 
      bdj_soj_identificador, bdj_soj_tipo_objeto, bdj_ddjj_id, bdj_base_imponible, 
      bdj_cuota, bdj_estado, bdj_fecha_presentacion, bdj_fiscalizada, bdj_impuesto_determinado,
      bdj_obn_id, bdj_pago_a_cuenta, bdj_percepciones, bdj_periodo, 
      bdj_prorroga, bdj_recaudaciones, bdj_retenciones, bdj_saldo, bdj_saldo_periodo_anterior, 
      bdj_tipo, bdj_total, bdj_vencimiento, bdj_trm_identificador) VALUES ('${ddjj.sujeto_id}', 
      '${ddjj.objeto_id}', '${ddjj.objeto_tipo}', '${uuid()}', ${ddjj.baseImponible}, 
      '${ddjj.cuota}', '${ddjj.estado}', '${moment().format("YYYY-MM-DD")}', 
      '${ddjj.fiscalizada}', ${ddjj.impuesto_determinado}, '${ddjj.obligacion_id}', 
      ${ddjj.pagoACuenta}, ${ddjj.percepciones}, '${ddjj.periodo}', 
      '${moment(ddjj.prorroga).format("YYYY-MM-DD")}', ${ddjj.recaudaciones}, 
      ${ddjj.retenciones}, ${ddjj.saldo}, ${ddjj.saldoPeriodoAnterior}, 
      '${ddjj.tipo}', ${ddjj.total}, '${moment(ddjj.vencimiento).format("YYYY-MM-DD")}', 
      '${ddjj.tramiteId}') IF NOT EXISTS;`

    let declaracionJurada = await this.execute(queryCreate, []);
    
    if (declaracionJurada[0].get(0) === false) {
      throw Object.assign(new Error, {
        message: 'Ya existe declaracion jurada con id: ' + ddjj.sujeto_id + ', ' +
        ddjj.objeto_id + ', ' + ddjj.objeto_tipo + ' y ' + ddjj.id,
        code: 'Bad Request',
        status: 400
      })
    }

    this.obligacionRepository.actualizarEstadoImporte(obligacion, ddjj);

    if (ddjjStored)
      this.updateEstadoDDJJ(ddjjStored[0], 'inactiva');

    return await this.findOne({where: {
      and: [{id: ddjj.id}, {sujeto_id: ddjj.sujeto_id}, 
      {objeto_id: ddjj.objeto_id}, {objeto_tipo: ddjj.objeto_tipo}]
    }});
  }

  formatterDDJJ(ddjj: any, obligacion: Obligacion, estado: string) {
    ddjj.tipo = 'IB';
    ddjj.objeto_id = obligacion.objeto_id;
    ddjj.objeto_tipo = obligacion.objeto_tipo;
    ddjj.cuota = obligacion.cuota;
    ddjj.fiscalizada = obligacion.fiscalizada;
    ddjj.baseImponible = ddjj.totales.totalImponible;
    ddjj.impuesto_determinado = ddjj.totales.totalImpuesto;
    ddjj.obligacion_id = obligacion.id;
    ddjj.pagoACuenta = ddjj.resumen.pagosACuenta;
    ddjj.periodo = obligacion.periodo;
    ddjj.recaudaciones = 0;
    ddjj.percepciones = ddjj.resumen.percepciones;
    ddjj.retenciones = ddjj.resumen.retenciones;
    ddjj.vencimiento = obligacion.vencimiento;
    ddjj.prorroga = obligacion.prorroga;
    ddjj.saldo = ddjj.resumen.totalAPagar;
    ddjj.saldoPeriodoAnterior = 0;
    ddjj.total = ddjj.resumen.totalAPagar;
    ddjj.estado = estado;
    return ddjj;
  }

  async updateEstadoDDJJ(ddjj: DeclaracionesJuradas, estado: string) {
    const query = `UPDATE read_side.buc_declaraciones_juradas SET bdj_estado='${estado}'
      WHERE bdj_suj_identificador='${ddjj.sujeto_id}' and
      bdj_soj_identificador='${ddjj.objeto_id}' and 
      bdj_soj_tipo_objeto='${ddjj.objeto_tipo}' and
      bdj_ddjj_id='${ddjj.id}' IF EXISTS`;
    await this.execute(query, []);
  }
}
