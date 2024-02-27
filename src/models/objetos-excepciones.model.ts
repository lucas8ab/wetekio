/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, model, property } from '@loopback/repository';

@model({ name: 'buc_objetos_excepciones' })
export class ObjetosExcepciones extends Entity {

  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'boe_soj_identificador',
  })
  objetoId: string;

  @property({
    type: 'string',
    name: 'boe_suj_identificador',
  })
  sujetoId?: string;

  @property({
    type: 'string',
    name: 'boe_soj_tipo_objeto',
  })
  tipoObjeto?: string;

  @property({
    type: 'string',
    name: 'boe_motivo',
  })
  motivo?: string;

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

  constructor(data?: Partial<ObjetosExcepciones>) {
    super(data);
  }
}

export interface ObjetosExcepcionesRelations {
  // describe navigational properties here
}

export type ObjetosExcepcionesWithRelations = ObjetosExcepciones &
  ObjetosExcepcionesRelations;
