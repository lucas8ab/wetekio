import {Entity, model, property, hasMany } from '@loopback/repository';
import {DomicilioObjeto} from './domicilio-objeto.model';
import {Obligacion} from './obligacion.model';
import {DeclaracionesJuradas} from './declaraciones-juradas.model';
import {Exenciones} from './exenciones.model';
import {Juicios} from './juicios.model';
import {Subastas} from './subastas.model';
import {ObligacionesExcepciones} from './obligaciones-excepciones.model';

@model({name: 'buc_sujeto_objeto', settings: {strict: false}})
export class Objeto extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'soj_identificador',
  })
  id: string;

  @property({
    type: 'string',
    name: 'soj_tipo_objeto',
  })
  tipo: string;

  @property({
    type: 'string',
    name: 'soj_cat_soj_id',
  })
  categoria?: string;

  @property({
    type: 'string',
    name: 'soj_descripcion',
  })
  descripcion?: string;

  @property({
    type: 'string',
    name: 'soj_estado',
  })
  estado?: string;

  @property({
    type: 'date',
    name: 'soj_fecha_fin',
  })
  fecha_fin?: string;

  @property({
    type: 'date',
    name: 'soj_fecha_inicio',
  })
  fecha_inicio?: string;

  @property({
    type: 'number',
    name: 'soj_saldo',
  })
  saldo?: number;

  @property({
    type: 'number',
    name: 'soj_base_imponible',
  })
  base_imponible?: number;

  @property({
    type: 'string',
    name: 'soj_etiquetas',
  })
  etiquetas?: string;

  @property({
    type: 'string',
    name: 'soj_id_externo',
  })
  id_externo?: string;

  @property({
    type: 'Object',
    name: 'soj_otros_atributos',
  })
  datos_adicionales?: string;

  @property({
    type: 'string',
    name: 'soj_suj_identificador',
  })
  sujeto_id: string;

  @hasMany(() => DomicilioObjeto, {keyTo: 'objeto_id'})
  domicilios: DomicilioObjeto[];

  @hasMany(() => Obligacion, {keyTo: 'objeto_id'})
  obligaciones: Obligacion[];

  @hasMany(() => DeclaracionesJuradas, {keyTo: 'objeto_id'})
  declaraciones_juradas: DeclaracionesJuradas[];

  @hasMany(() => Exenciones, {keyTo: 'objeto_id'})
  exenciones: Exenciones[];

  @hasMany(() => Juicios, {keyTo: 'objeto_id'})
  juicios: Juicios[];

  @hasMany(() => Subastas, { keyTo: 'objeto_id' })
  subastas: Subastas[];

  saldoForDiscounts?: number;
  saldoVencido = 0;
  saldoNoVencido = 0;
  isExcluded?: boolean;

  constructor(data?: Partial<Objeto>) {
    super(data);
  }
}

export interface ObjetoRelations {
  // describe navigational properties here
}

export type ObjetoWithRelations = Objeto & ObjetoRelations;