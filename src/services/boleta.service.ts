import {bind, /* inject, */ BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { BoletaPagoRepository, SujetoRepository, ObligacionRepository, ParamRecargoRepository } from '../repositories';
import { BoletaPago, ParamRecargo, Obligacion } from '../models';
import moment = require('moment');

@bind({scope: BindingScope.TRANSIENT})
export class BoletaService {
  constructor(
    @repository(BoletaPagoRepository)
    public boletaPagoRepository : BoletaPagoRepository,
    @repository(ObligacionRepository)
    public obligacionRepository : ObligacionRepository,
    @repository(ParamRecargoRepository)
    public paramRecargoRepository : ParamRecargoRepository,
  ) {}

  /*
    Funciones que le aplican calculos y formato a la boleta antes de registrar 
  */
  async formatterBoleta(boleta: BoletaPago) {
    const recargos:Array<ParamRecargo> = await this.paramRecargoRepository.find();
      const promesas = await boleta.obligaciones.map(async (item:any) => {
        //@ts-ignore
        const obn : Obligacion = await this.obligacionRepository.findOne({where: {
          id: item.id,
          sujeto_id: boleta.sujeto_id,
          objeto_id: item.objeto_id,
          objeto_tipo: item.objeto_tipo,
        }});
        return Object.assign({}, {
          id: obn.id,
          sujeto_id: obn.sujeto_id,
          objeto_id: obn.objeto_id,
          objeto_tipo: obn.objeto_tipo,
          concepto: obn.concepto,
          impuesto: obn.impuesto,
          saldo: this.calculateSaldo(obn,recargos),
          vencimiento: obn.vencimiento,
          prorroga: obn.prorroga,
          cuota: obn.cuota,
          periodo: obn.periodo,
        });
      });
      //@ts-ignore
      boleta.obligaciones = await Promise.all(promesas);
      
      let importe = 0;
      //@ts-ignore
      await boleta.obligaciones.forEach((item: any, i) => {
        if (!item.saldo || item.saldo == null) this.errorBadRequest(i);
        importe = Math.fround(parseFloat(item.saldo) + importe);
      });

      Object.assign(boleta, {
        importe: importe.toFixed(2),
        estado_id: '00',
        estado_descripcion: 'A pagar',
        fecha: moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
        numero: (new Date).getTime(),
        //@ts-ignore
        obligaciones: this.formatterObligaciones(boleta.obligaciones),
      });

      return await this.boletaPagoRepository.createBoleta(boleta);
  }

  calculateSaldo(obn: Obligacion,recargos:Array<ParamRecargo>) {
    obn.aplicarInteresWithLogs(recargos);
    const exencion = obn.porcentaje_exencion?? 0;
    return (Math.fround(1- (exencion / 100)) *  obn.saldoConRecargo).toFixed(2);
  }

  errorBadRequest(pos: number) {
    let err = new Error();
    Object.assign(err, {
      message: `Falta el saldo en el item ${pos + 1} de las obligaciones.`,
      code: 'Bad Request',
      status: 400
    });
    throw err;
  }

  formatterObligaciones(obligaciones: []) {
    return obligaciones.map((obn) => {
      Object.keys(obn).forEach((key) => {
        //@ts-ignore
        obn[key] = obn[key].toString(); 
      });
      return obn;
    });
  }
}
