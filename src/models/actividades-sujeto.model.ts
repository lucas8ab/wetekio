import { Entity, model, property } from '@loopback/repository';

@model({ name: 'buc_actividades_sujeto' })
export class ActividadesSujeto extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'bat_atd_id'
  })
  id: string;

  @property({
    type: 'string',
    name: 'bat_descripcion'
  })
  descripcion?: string;

  @property({
    type: 'date',
    name: 'bat_fecha_fin'
  })
  fecha_fin?: string;

  @property({
    type: 'date',
    name: 'bat_fecha_inicio'
  })
  fecha_inicio?: string;

  @property({
    type: 'object',
    name: 'bat_otros_atributos'
  })
  datos_adicionales?: object;

  @property({
    type: 'string',
    name: 'bat_referencia'
  })
  referencia?: string;

  @property({
    type: 'string',
    name: 'bat_tipo'
  })
  tipo?: string;

  @property({
    type: 'string',
    name: 'bat_suj_identificador'
  })
  sujeto_id?: string;


  constructor(data?: Partial<ActividadesSujeto>) {
    super(data);
  }
}

export interface ActividadesSujetoRelations {
  // describe navigational properties here
}

export type ActividadesSujetoWithRelations = ActividadesSujeto & ActividadesSujetoRelations;
