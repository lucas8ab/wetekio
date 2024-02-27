import { Entity, model, property, Model } from '@loopback/repository';
import moment = require('moment');

@model({ name: 'buc_planes_pago' })
export class PlanesPago extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    name: 'bpl_pln_id'
  })
  id: string;

  @property({
    type: 'number',
    name: 'bpl_cantidad_cuotas'
  })
  cantidadCuotas: number;

  @property({
    type: 'string',
    name: 'bpl_estado',
    default: '0'
  })
  estado?: string;

  @property({
    type: 'date',
    name: 'bpl_fecha_act_deuda',
    default: undefined
  })
  fechaActDeuda?: string;

  @property({
    type: 'date',
    name: 'bpl_fecha_emision',
    default: moment().format('YYYY-MM-DD')
  })
  fechaEmision?: string;

  @property({
    type: 'date',
    name: 'bpl_fecha_anticipo',
  })
  fechaAnticipo: string;

  @property({
    type: 'number',
    name: 'bpl_importe_a_financiar'
  })
  importeAFinanciar: number;

  @property({
    type: 'number',
    name: 'bpl_importe_anticipo'
  })
  importeAnticipo: number;

  @property({
    type: 'number',
    name: 'bpl_importe_financiado'
  })
  importeFinanciado?: number;

  @property({
    type: 'string',
    name: 'bpl_nro_referencia'
  })
  numeroReferencia?: string;

  @property({
    type: 'string',
    name: 'bpl_tipo'
  })
  tipo?: string;

  
  @property({
    cassandra: {
      columnName: 'bpl_otros_atributos',
      dataType: Object
    }
  })
  datosAdicionales: object
  

  @property({
    type: 'array',
    itemType: 'object',
    name: 'bpl_detalle',
    cassandra: {
      dataType: 'list<frozen<buc_planes_pago_item_detalle>>'
    }
  })
  detalle: Array<Object>

  @property({
    type: 'string',
    name: 'bpl_suj_identificador'
  })
  sujeto_id: string;


  constructor(data?: Partial<PlanesPago>) {
    super(data);
  }
}

export interface PlanesPagoRelations {
  // describe navigational properties here
}

export type PlanesPagoWithRelations = PlanesPago & PlanesPagoRelations;
