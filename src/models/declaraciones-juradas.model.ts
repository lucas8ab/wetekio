import { Entity, model, property } from '@loopback/repository';

@model({ name: 'buc_declaraciones_juradas' })
export class DeclaracionesJuradas extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    name: 'bdj_ddjj_id'
  })
  id?: string;

  @property({
    type: 'string',
    name: 'bdj_cuota'
  })
  cuota?: string;

  @property({
    type: 'string',
    name: 'bdj_estado'
  })
  estado?: string;

  @property({
    type: 'string',
    name: 'bdj_fiscalizada'
  })
  fiscalizada?: string;

  @property({
    type: 'number',
    name: 'bdj_impuesto_determinado'
  })
  impuesto_determinado?: number;

  @property({
    type: 'object',
    name: 'bdj_otros_atributos'
  })
  datos_adicionales?: object;

  @property({
    type: 'number',
    name: 'bdj_percepciones'
  })
  percepciones?: number;

  @property({
    type: 'string',
    name: 'bdj_periodo'
  })
  periodo?: string;

  @property({
    type: 'date',
    name: 'bdj_prorroga'
  })
  prorroga?: string;

  @property({
    type: 'number',
    name: 'bdj_recaudaciones'
  })
  recaudaciones?: number;

  @property({
    type: 'number',
    name: 'bdj_retenciones'
  })
  retenciones?: number;

  @property({
    type: 'string',
    name: 'bdj_tipo'
  })
  tipo?: string;

  @property({
    type: 'number',
    name: 'bdj_total'
  })
  total?: number;

  @property({
    type: 'date',
    name: 'bdj_vencimiento'
  })
  vencimiento?: string;

  @property({
    type: 'string',
    name: 'bdj_suj_identificador'
  })
  sujeto_id?: string;

  @property({
    type: 'string',
    name: 'bdj_soj_tipo_objeto'
  })
  objeto_tipo?: string;

  @property({
    type: 'string',
    name: 'bdj_soj_identificador'
  })
  objeto_id?: string;

  @property({
    type: 'string',
    name: 'bdj_obn_id'
  })
  obligacion_id?: string;

  @property({
    type: 'number',
    name: 'bdj_base_imponible'
  })
  baseImponible?: number;

  @property({
    type: 'number',
    name: 'bdj_pago_a_cuenta'
  })
  pagoACuenta?: number;

  @property({
    type: 'number',
    name: 'bdj_saldo'
  })
  saldo?: number;

  @property({
    type: 'number',
    name: 'bdj_saldo_periodo_anterior'
  })
  saldoPeriodoAnterior?: number;
  
  @property({
    type: 'date',
    name: 'bdj_fecha_presentacion'
  })
  fechaPresentacion?: string;

  @property({
    type: 'string',
    name: 'bdj_trm_identificador'
  })
  tramiteId?: string;

  constructor(data?: Partial<DeclaracionesJuradas>) {
    super(data);
  }
}

export interface DeclaracionesJuradasRelations {
  // describe navigational properties here
}

export type DeclaracionesJuradasWithRelations = DeclaracionesJuradas & DeclaracionesJuradasRelations;
