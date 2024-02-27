import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Juicios } from './juicios.model';

@model({ name: 'buc_etapas_proc' })
export class EtapasProc extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'bep_eta_id'
  })
  id: string;

  @property({
    type: 'string',
    name: 'bep_descripcion'
  })
  descripcion?: string;

  @property({
    type: 'date',
    name: 'bep_fecha_fin'
  })
  fecha_fin?: string;

  @property({
    type: 'date',
    name: 'bep_fecha_inicio'
  })
  fecha_inicio?: string;

  @property({
    type: 'object',
    name: 'bep_otros_atributos'
  })
  datos_adicionales?: object;

  @property({
    type: 'string',
    name: 'bep_referencia'
  })
  referencia?: string;

  @property({
    type: 'string',
    name: 'bep_tipo'
  })
  tipo?: string;

  @belongsTo(() => Juicios)
  juicio_id: number;

  constructor(data?: Partial<EtapasProc>) {
    super(data);
  }
}

export interface EtapasProcRelations {
  // describe navigational properties here
}

export type EtapasProcWithRelations = EtapasProc & EtapasProcRelations;
