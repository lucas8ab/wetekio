/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-var */
import { DefaultCrudRepository, EntityNotFoundError, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import { Obligacion, ObligacionRelations, PlanesPago, Objeto, ObligacionesExcepciones} from '../models';
import { CassandraBucDataSource } from '../datasources';
import { inject, Getter} from '@loopback/core';
import {ObligacionesExcepcionesRepository} from './obligaciones-excepciones.repository';

import moment = require('moment');

export class ObligacionRepository extends DefaultCrudRepository<
  Obligacion,
  typeof Obligacion.prototype.id,
  ObligacionRelations
  > {

  public readonly obligacionExceptuada: HasOneRepositoryFactory<ObligacionesExcepciones, typeof Obligacion.prototype.id>;

  constructor(
    @inject('datasources.cassandra_buc')
     dataSource: CassandraBucDataSource, @repository.getter('ObligacionesExcepcionesRepository') protected obligacionesExcepcionesRepositoryGetter: Getter<ObligacionesExcepcionesRepository>,
  ) {
    super(Obligacion, dataSource);
    this.obligacionExceptuada = this.createHasOneRepositoryFactoryFor('obligacionExceptuada', obligacionesExcepcionesRepositoryGetter);
    this.registerInclusionResolver('obligacionExceptuada', this.obligacionExceptuada.inclusionResolver);
  }

  async setEstado(estado: string,
    filtro: { id: string, sujeto_id: string, objeto_id: string, tipo_objeto: string }) {
    //@ts-ignore
    var result: Row[] = await this.execute(`update read_side.buc_obligaciones SET
      bob_estado='${estado}' where bob_suj_identificador='${filtro.sujeto_id}'
      and bob_soj_tipo_objeto='${filtro.tipo_objeto}' and
      bob_soj_identificador='${filtro.objeto_id}' and
      bob_obn_id='${filtro.id}' IF EXISTS`, []);
    if (result[0].get(0) === true) {
      return {};
    }
    throw new EntityNotFoundError(Obligacion, 'obligacion');
  }

  async findByManyId(objeto_id: string, objeto_tipo: string) {
    var query = `SELECT * FROM read_side.buc_obligaciones
      WHERE bob_soj_identificador='${objeto_id}'
      and bob_soj_tipo_objeto='${objeto_tipo}' ALLOW FILTERING`;
    var result = await this.execute(query, []);
    if (result.length > 0) {
      //@ts-ignore
      return await result.map((item) => {
        return Object.assign({}, {
          id: item.bob_obn_id,
          sujeto_id: item.bob_suj_identificador,
          objeto_id: item.bob_soj_identificador,
          tipo_objeto: item.bob_soj_tipo_objeto,
          capital: item.bob_capital,
          concepto: item.bob_concepto,
          cuota: item.bob_cuota,
          estado: item.bob_estado,
          exenta: item.bob_exenta,
          fiscalizada: item.bob_fiscalizada,
          impuesto: item.bob_impuesto,
          indice_interes_punitorio: item.bob_indice_int_punit,
          indice_interes_resarcitorio: item.bob_indice_int_resar,
          interes_punitorio: item.bob_interes_punit,
          interes_resarcitorio: item.bob_interes_resar,
          juicio_id: item.bob_jui_id,
          periodo: item.bob_periodo,
          plan_id: item.bob_pln_id,
          prorroga: item.bob_prorroga,
          tipo: item.bob_tipo,
          total: item.bob_total,
          saldo: item.bob_saldo,
          vencimiento: item.bob_vencimiento,
          porcentaje_exencion: item.bob_porcentaje_exencion,
          datos_adicionales: item.bob_otros_atributos
        });
      });
    }
    throw new EntityNotFoundError(Obligacion, 'objeto_id o tipo_objeto');
  }

  async actualizarEstados(obligaciones: any[], estado: string) {
    await obligaciones.forEach(async (item: any) => {
      const obn = await this.findOne({
        where: {
          id: item.id,
          sujeto_id: item.sujeto_id
        }
      });
      if (!obn) throw new EntityNotFoundError(Obligacion, 'id o sujeto_id');
      await this.setEstado(estado, {
        id: obn.id,
        sujeto_id: obn.sujeto_id,
        objeto_id: obn.objeto_id,
        tipo_objeto: obn.objeto_tipo
      });
    });
  }

  async createObligacionesPlanPago(plan: PlanesPago, objeto: Objeto) {
    let saldo = Math.fround(plan.importeAFinanciar / plan.cantidadCuotas);
    let obnId = `2020${(new Date()).getTime()}`;
    let obligaciones = [await this.createObligacion(`${obnId}0`, 'A', moment().year().toString(), 
    '9', '999', plan.importeAnticipo, moment(plan.fechaAnticipo).format('YYYY-MM-DD'), 
    moment().add(5, 'd').format('YYYY-MM-DD'), plan.id, plan.sujeto_id, 
    `${objeto.id}`,`${objeto.tipo}`)];

    for(let c=1; c <= plan.cantidadCuotas; c++) {
      let obn = await this.createObligacion(`${obnId}${c}`, c.toString(), moment().year().toString(), 
        '9', '999', saldo, 
        moment(new Date(moment().year(),moment().month()+c,10)).format('YYYY-MM-DD'), 
        moment(new Date(moment().year(),moment().month()+c,15)).format('YYYY-MM-DD'), 
        plan.id, plan.sujeto_id, `${objeto.id}`,`${objeto.tipo}`);
      obligaciones.push(obn);
    }
    return obligaciones;
  }

  async createObligacion(id: string, cuota: string, periodo: string, impuesto: string, concepto: string,
    saldo: number, vencimiento: string, prorroga: string, plan_id: string, sujeto_id: string,
    objeto_id: string, objeto_tipo: string) {
    const query = `INSERT INTO read_side.buc_obligaciones (bob_obn_id, bob_cuota, bob_periodo, bob_impuesto,
      bob_concepto, bob_capital, bob_saldo, bob_total, bob_vencimiento, bob_prorroga, bob_pln_id,
      bob_suj_identificador, bob_soj_identificador, bob_soj_tipo_objeto) values('${id}','${cuota}',
        '${periodo}','${impuesto}','${concepto}',${saldo},${saldo},${saldo},'${vencimiento}','${prorroga}',
        '${plan_id}','${sujeto_id}','${objeto_id}','${objeto_tipo}') IF NOT EXISTS`;
    //@ts-ignore
    let obn: Row[] = await this.execute(query, []);
    if (obn[0].get(0) !== true) {
      throw Object.assign(new Error, {
        message: 'Problemas para crear la obligacion.',
        code: 'Gone',
        status: 410
      })
    }
    return await this.findById(id);
  }

  async getBySujetoPeriodoCuota(sujetoId: string, periodo: string, cuota: string) {
    const obligaciones = await this.find({
      where: {
        sujeto_id: sujetoId,
      }
    });
    if (!obligaciones)
      throw new EntityNotFoundError(Obligacion, 'sujeto_id');
    let obligacion = obligaciones.filter(o => 
      o.periodo == periodo && 
      o.cuota == cuota && 
      o.objeto_tipo == 'E');
    if (obligacion.length == 0)
      throw new EntityNotFoundError(Obligacion, 'sujeto_id, periodo y cuota');
    return obligacion[0];
  }

  async actualizarEstadoImporte(obligacion: Obligacion, ddjj: any) {
    //@ts-ignore
    var result: Row[] = await this.execute(`update read_side.buc_obligaciones SET
      bob_estado='${ddjj.estado}', bob_total=${ddjj.resumen.totalAPagar},
      bob_saldo=${ddjj.resumen.totalAPagar}
      where bob_suj_identificador='${obligacion.sujeto_id}'
      and bob_soj_tipo_objeto='${obligacion.objeto_tipo}' and
      bob_soj_identificador='${obligacion.objeto_id}' and
      bob_obn_id='${obligacion.id}' IF EXISTS`, []);
    if (result[0].get(0) === true) {
      return {};
    }
    throw new EntityNotFoundError(Obligacion, 'obligacion');
    }
}
