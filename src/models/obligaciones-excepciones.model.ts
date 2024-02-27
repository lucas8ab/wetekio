/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, model, property } from '@loopback/repository';

@model({name: 'buc_obligaciones_excepciones'})
export class ObligacionesExcepciones extends Entity {

  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'boe_obn_identificador',
  })
  obligacionId?: string;

  @property({
    type: 'string',
    name: 'boe_suj_identificador',
  })
  sujetoId?: string;

  @property({
    type: 'string',
    name: 'boe_soj_identificador',
  })
  objetoId?: string;

  @property({
    type: 'string',
    name: 'boe_soj_tipo_objeto',
  })
  tipoObjeto?: string;

  @property({
    type: 'Date',
    name: 'boe_fecha_baja',
  })
  fechaBaja?: string;

  @property({
    type: 'number',
    name: 'boe_saldo',
  })
  saldo?: number;

  @property({
    type: 'string',
    name: 'boe_motivo',
  })
  motivo?: string;

  constructor(data?: Partial<ObligacionesExcepciones>) {
    super(data);
  }
}

export interface ObligacionesExcepcionesRelations {
  // describe navigational properties here
}

export type ObligacionesExcepcionesWithRelations = ObligacionesExcepciones &
  ObligacionesExcepcionesRelations;
