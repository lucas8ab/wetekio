import { Entity, model, property, hasOne} from '@loopback/repository';
import moment = require('moment');
import { ParamRecargo } from './param-recargo.model';
import { CuponesDescuentos } from './cupones-descuentos.model';
import CuponDetail from '../interfaces/cupones-detalles.interface';
import {ObligacionesExcepciones} from './obligaciones-excepciones.model';

@model({name: 'buc_obligaciones', settings: {strict: true}})
export class Obligacion extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'bob_obn_id'
  })
  id: string;

  @property({
    type: 'number',
    name: 'bob_capital'
  })
  capital: number;

  @property({
    type: 'string',
    name: 'bob_cuota'
  })
  cuota: string;

  @property({
    type: 'string',
    name: 'bob_estado'
  })
  estado: string;

  @property({
    type: 'string',
    name: 'bob_fiscalizada'
  })
  fiscalizada?: string;

  @property({
    type: 'string',
    name: 'bob_indice_int_punit'
  })
  indice_interes_punitorio?: string;

  @property({
    type: 'string',
    name: 'bob_indice_int_resar'
  })
  indice_interes_resarcitorio?: string;

  @property({
    type: 'number',
    name: 'bob_interes_punit'
  })
  interes_punitorio?: number;

  @property({
    type: 'number',
    name: 'bob_interes_resar'
  })
  interes_resarcitorio?: number;

  @property({
    type: 'number',
    name: 'bob_jui_id'
  })
  juicio_id?: number;

  @property({
    type: 'string',
    name: 'bob_periodo'
  })
  periodo: string;

  @property({
    type: 'string',
    name: 'bob_pln_id'
  })
  plan_id?: string;

  @property({
    type: 'date',
    name: 'bob_prorroga'
  })
  prorroga?: string;

  @property({
    type: 'string',
    name: 'bob_tipo'
  })
  tipo?: string;

  @property({
    type: 'number',
    name: 'bob_total'
  })
  total?: number;

  @property({
    type: 'number',
    name: 'bob_saldo'
  })
  saldo: number;

  @property({
    type: 'date',
    name: 'bob_vencimiento'
  })
  vencimiento?: string;

  @property({
    type: 'string',
    name: 'bob_concepto'
  })
  concepto?: string;

  @property({
    type: 'string',
    name: 'bob_impuesto'
  })
  impuesto?: string;

  @property({
    type: 'boolean',
    name: 'bob_exenta'
  })
  exenta?: boolean;

  @property({
    type: 'number',
    name: 'bob_porcentaje_exencion'
  })
  porcentaje_exencion?: number;

  @property({
    type: 'Object',
    name: 'bob_otros_atributos'
  })
  datos_adicionales?: string;

  @property({
    type: 'string',
    name: 'bob_suj_identificador'
  })
  sujeto_id: string;

  @property({
    type: 'string',
    name: 'bob_soj_identificador'
  })
  objeto_id: string;

  @property({
    type: 'string',
    name: 'bob_soj_tipo_objeto'
  })
  objeto_tipo: string;

  @hasOne(() => ObligacionesExcepciones, {keyTo: 'obligacionId'})
  obligacionExceptuada: ObligacionesExcepciones;

  interesRecargo: number;
  saldoConRecargo: number;
  vencida: boolean;
  descuento: number;
  honorarioPrejudicial?: number;

  constructor(data?: Partial<Obligacion>) {
    super(data);
    this.setIsVencida();
  }

  /**
   * Metodo para setear la propiedad vencida.
   */
  setIsVencida(): void {
    const fechaProrroga = moment(this.prorroga, "YYYYMMDD").utc().format("YYYY-MM-DD");
    this.vencida = (moment().diff(fechaProrroga) > 0);
  }

  /**
   * Metodo para saber si la obligacion esta vencida y exceptuada.
   */
  isExcepted(): boolean {
    return (this.obligacionExceptuada && this.obligacionExceptuada.fechaBaja === null);
  }

  /**
   * Metodo para saber si la obligacion es cuota 0 y si esta vencida 
   */
   isCuotaUnicaVencida(): boolean {
    return (this.cuota === "0" && this.vencida);
  }

  /**
   * Metodo para aplicar el descuento a la obligacion a partir de una lista de cupones.
   * @param cupones - lista de cupones validos.
   */
  aplicarDescuento(cupones: Array<CuponesDescuentos>) {

    if(!this.vencida) {

      const cuponObligation: CuponesDescuentos | undefined = cupones.find((cupon: CuponesDescuentos) => cupon.obligacionId === this.id);

      this.descuento = 0;
  
      if (cuponObligation && cuponObligation.detalles) {
  
        // DESCUENTO
        //=========================================================
        cuponObligation.detalles.forEach((detail: CuponDetail) => {
  
          this.saldoConRecargo -= detail.bdc_monto;
          this.descuento += detail.bdc_monto;
  
        });
        //=========================================================
      }

    }
  }

   /**
   * Metodo para aplicar el interes a la obligacion a partir de una lista de parametricas de recargo.
   * @param recargos - lista de parametricas de recargo.
   */
    aplicarInteresWithLogs(recargos: Array<ParamRecargo>) {

      console.log("=================== INIT INTERES ===================  \n");

      console.log(` OBLIGACION: ${this.id} \n`);
      
      console.log(` OBLIGACION VENCIMIENTO: ${this.vencimiento} `);
      console.log(` OBLIGACION PRORROGA: ${this.prorroga} `);
      console.log(` OBLIGACION CONCEPTO: ${this.concepto} `);
      console.log(` OBLIGACION IMPUESTO: ${this.impuesto} `);
      console.log(` OBLIGACION PERIODO: ${this.periodo} \n`);

      if(process.env.INTERESES_LOG?.trim() === ("ON-DEBUG")) {

        // Se loguean todas las parametricas cargadas.

        console.log(` --- PARAMETICAS REGARGO DISPONIBLES---  \n`);
        console.log(` ${JSON.stringify(recargos)} `);
        console.log(` --- / PARAMETICAS REGARGO DISPONIBLES/ ---  \n`);

      }

      this.interesRecargo = 0;
  
      console.log(` ¿ La Obligacion esta vencida ? -> ${this.vencida}  \n`);
      if (this.vencida) {
        // INTERES
        //=========================================================
        const param = recargos.filter(r => {
          const prorroga = this.prorroga ?? this.vencimiento ?? '1900-01-01';
          const fechaDesde = r.fecha_desde ?? '1900-01-01';
          const fechaHasta = r.fecha_hasta ?? '2099-01-01';
  
          return (moment(prorroga).isBetween(fechaDesde, fechaHasta) &&
            this.concepto === r.concepto &&
            this.impuesto === r.impuesto &&
            this.periodo === r.periodo)
        });
        console.log(` --- PARAMETICAS FILTRADAS PARA LA OBLIGACION ---  \n`);
        console.log(`${JSON.stringify(param)}`);
        console.log(`\n`)
  
        console.log(` --- VALIDACION PARA APLICAR INTERES --- `);
        console.log(`parametricasfiltradas.length > 0 && parametricasfiltradas[0].valor`);
        console.log(`parametricasfiltradas.length > 0 -> ${param.length > 0}`);
        if(param[0])
          console.log(`parametricasfiltradas[0].valor -> ${param[0].valor}  \n`);

        if (param.length > 0 && param[0].valor) {
          console.log(` --- INTERES CALCULADO (entra aqui si la validacion anterior es true) --- `);
          this.interesRecargo = parseFloat((param[0].valor / 100 * this.saldo * moment().diff(this.prorroga, 'days') / 360).toFixed(2));
          console.log(`VALOR -> ${this.interesRecargo}`);
        }

        // INTERES PREJUDICIAL
        if (this.capital && this.interesRecargo && this.estado === 'PREJUDICIAL') {
          this.aplicarInteresPrejudicial();
        }
        //=========================================================
      }
      console.log(` --- SALDO + INTERES (RESULTADO FINAL) --- `);
      this.saldoConRecargo = this.saldo + this.interesRecargo;
      console.log(` ${this.saldoConRecargo} \n`);

      console.log("=================== END INTERES ===================");
    }

    /**
   * Metodo para calcular el interes prejudicial de la obligacion.
   */
  private aplicarInteresPrejudicial() {
    this.honorarioPrejudicial = parseFloat(
      ((this.capital + this.interesRecargo) * 0.10 * 1.21).toFixed(5),
    );
  }

}


export interface ObligacionRelations {
  // describe navigational properties here
}

export type ObligacionWithRelations = Obligacion & ObligacionRelations;
