/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, model, property } from '@loopback/repository';

@model({ name: 'buc_sujetos_excepciones' })
export class SujetosExcepciones extends Entity {

  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'bse_suj_identificador',
  })
  sujetoId: string;

  @property({
    type: 'date',
    name: 'bse_fecha_baja',
  })
  fechaBaja?: string;

  @property({
    type: 'number',
    name: 'bse_saldo',
  })
  saldo?: number;

  @property({
    type: 'string',
    name: 'bse_motivo',
  })
  motivo?: string;

  constructor(data?: Partial<SujetosExcepciones>) {
    super(data);
  }
}

export interface SujetosExcepcionesRelations {
  // describe navigational properties here
}

export type SujetosExcepcionesWithRelations = SujetosExcepciones &
  SujetosExcepcionesRelations;