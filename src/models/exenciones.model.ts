import { Entity, model, property } from '@loopback/repository';

@model({ name: 'buc_exenciones' })
export class Exenciones extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'bex_exe_id'
  })
  id: string;

  @property({
    type: 'string',
    name: 'bex_descripcion'
  })
  descripcion?: string;

  @property({
    type: 'date',
    name: 'bex_fecha_fin'
  })
  fecha_fin?: string;

  @property({
    type: 'date',
    name: 'bex_fecha_inicio'
  })
  fecha_inicio?: string;

  @property({
    type: 'string',
    name: 'bex_periodo'
  })
  periodo?: string;

  @property({
    type: 'number',
    name: 'bex_porcentaje'
  })
  porcentaje?: number;

  @property({
    type: 'string',
    name: 'bex_tipo'
  })
  tipo?: string;

  @property({
    type: 'string',
    name: 'bex_suj_identificador'
  })
  sujeto_id?: string;

  @property({
    type: 'string',
    name: 'bex_soj_tipo_objeto'
  })
  objeto_tipo?: string;

  @property({
    type: 'string',
    name: 'bex_soj_identificador'
  })
  objeto_id?: string;


  constructor(data?: Partial<Exenciones>) {
    super(data);
  }
}

export interface ExencionesRelations {
  // describe navigational properties here
}

export type ExencionesWithRelations = Exenciones & ExencionesRelations;
