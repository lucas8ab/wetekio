import { Entity, model, property } from '@loopback/repository';

@model({ name: 'buc_subastas' })
export class Subastas extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'bsb_sub_id'
  })
  id: string;

  @property({
    type: 'string',
    name: 'bsb_auto'
  })
  auto?: string;

  @property({
    type: 'date',
    name: 'bsb_fecha_fin'
  })
  fecha_fin?: string;

  @property({
    type: 'date',
    name: 'bsb_fecha_inicio'
  })
  fecha_inicio?: string;

  @property({
    type: 'string',
    name: 'bsb_suj_identificador_sub'
  })
  sujeto_id_sub?: string;

  @property({
    type: 'string',
    name: 'bsb_tipo'
  })
  tipo?: string;

  @property({
    type: 'string',
    name: 'bsb_suj_identificador'
  })
  sujeto_id?: string;

  @property({
    type: 'string',
    name: 'bsb_soj_tipo_objeto'
  })
  objeto_tipo?: string;

  @property({
    type: 'string',
    name: 'bsb_soj_identificador'
  })
  objeto_id?: string;


  constructor(data?: Partial<Subastas>) {
    super(data);
  }
}

export interface SubastasRelations {
  // describe navigational properties here
}

export type SubastasWithRelations = Subastas & SubastasRelations;
