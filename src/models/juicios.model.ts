import { Entity, model, property, hasMany} from '@loopback/repository';
import {EtapasProc} from './etapas-proc.model';

@model({ name: 'buc_juicios' })
export class Juicios extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
    generated: false,
    name: 'bju_jui_id'
  })
  id: number;

  @property({
    type: 'number',
    name: 'bju_capital'
  })
  capital?: number;

  @property({
    type: 'string',
    name: 'bju_estado'
  })
  estado?: string;

  @property({
    type: 'string',
    name: 'bju_fiscalizada'
  })
  fiscalizada?: string;

  @property({
    type: 'number',
    name: 'bju_gastos'
  })
  gastos?: number;

  @property({
    type: 'number',
    name: 'bju_gastos_mart'
  })
  gastos_martillero?: number;

  @property({
    type: 'number',
    name: 'bju_honorarios'
  })
  honorarios?: number;

  @property({
    type: 'number',
    name: 'bju_honorarios_mart'
  })
  honorarios_martillero?: number;

  @property({
    type: 'date',
    name: 'bju_inicio_demanda'
  })
  inicio_demanda?: string;

  @property({
    type: 'number',
    name: 'bju_interes_punit'
  })
  interes_punitorios?: number;

  @property({
    type: 'number',
    name: 'bju_interes_resar'
  })
  interes_resarcitorio?: number;

  @property({
    type: 'object',
    name: 'bju_otros_atributos'
  })
  datos_adicionales?: object;

  @property({
    type: 'number',
    name: 'bju_pcr_id'
  })
  pcr_id?: number;

  @property({
    type: 'number',
    name: 'bju_porcentaje_iva'
  })
  porcentaje_iva?: number;

  @property({
    type: 'string',
    name: 'bju_procurador'
  })
  procurador?: string;

  @property({
    type: 'string',
    name: 'bju_tipo'
  })
  tipo?: string;

  @property({
    type: 'number',
    name: 'bju_total'
  })
  total?: number;

  @property({
    type: 'string',
    name: 'bju_suj_identificador'
  })
  sujeto_id: string;

  @property({
    type: 'string',
    name: 'bju_soj_tipo_objeto'
  })
  objeto_tipo: string;

  @property({
    type: 'string',
    name: 'bju_soj_identificador'
  })
  objeto_id: string;

  @hasMany(() => EtapasProc ,{keyTo: 'juicio_id'})
  etapasJuicio: EtapasProc[];

  constructor(data?: Partial<Juicios>) {
    super(data);
  }
}

export interface JuiciosRelations {
  // describe navigational properties here
}

export type JuiciosWithRelations = Juicios & JuiciosRelations;
