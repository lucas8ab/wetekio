import { Entity, model, property } from '@loopback/repository';

@model({ name: 'buc_param_recargo' })
export class ParamRecargo extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'bpr_indice'
  })
  indice: string;

  @property({
    type: 'string',
    name: 'bpr_tipo_indice'
  })
  tipo_indice?: string;

  @property({
    type: 'string',
    name: 'bpr_descripcion'
  })
  descripcion?: string;

  @property({
    type: 'date',
    name: 'bpr_fecha_desde'
  })
  fecha_desde?: string;

  @property({
    type: 'date',
    name: 'bpr_fecha_hasta'
  })
  fecha_hasta?: string;

  @property({
    type: 'number',
    name: 'bpr_valor'
  })
  valor?: number;

  @property({
    type: 'string',
    name: 'bpr_concepto'
  })
  concepto?: string

  @property({
    type: 'string',
    name: 'bpr_impuesto'
  })
  impuesto?: string

  @property({
    type: 'string',
    name: 'bpr_periodo'
  })
  periodo?: string

  constructor(data?: Partial<ParamRecargo>) {
    super(data);
  }
}

export interface ParamRecargoRelations {
  // describe navigational properties here
}

export type ParamRecargoWithRelations = ParamRecargo & ParamRecargoRelations;
