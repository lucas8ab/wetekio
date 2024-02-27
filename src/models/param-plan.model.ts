import { Entity, model, property } from '@loopback/repository';

@model({ name: 'buc_param_plan' })
export class ParamPlan extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'bpp_fpm_id'
  })
  id: string;

  @property({
    type: 'number',
    name: 'bpp_cant_max_cuotas'
  })
  cantidad_maxima_cuotas?: number;

  @property({
    type: 'number',
    name: 'bpp_cant_min_cuotas'
  })
  cantidad_minima_cuotas?: number;

  @property({
    type: 'string',
    name: 'bpp_decreto'
  })
  decreto?: string;

  @property({
    type: 'number',
    name: 'bpp_dias_vto_cuotas'
  })
  dias_vencimiento_cuotas?: number;

  @property({
    type: 'date',
    name: 'bpp_fecha_desde_deuda'
  })
  fecha_desde_deuda?: string;

  @property({
    type: 'date',
    name: 'bpp_fecha_hasta_deuda'
  })
  fecha_hasta_deuda?: string;

  @property({
    type: 'date',
    name: 'bpp_fecha_fin'
  })
  fecha_fin?: string;

  @property({
    type: 'date',
    name: 'bpp_fecha_inicio'
  })
  fecha_inicio?: string;

  @property({
    type: 'string',
    name: 'bpp_fpm_descripcion'
  })
  fpm_descripcion?: string;

  @property({
    type: 'string',
    name: 'bpp_indice_int_financ'
  })
  indice_interes_financiero?: string;

  @property({
    type: 'string',
    name: 'bpp_indice_int_punit'
  })
  indice_interes_punitorios?: string;

  @property({
    type: 'string',
    name: 'bpp_indice_int_resar'
  })
  indice_interes_resarcitorio?: string;

  @property({
    type: 'number',
    name: 'bpp_monto_max_deuda'
  })
  monto_maxima_deuda?: number;

  @property({
    type: 'number',
    name: 'bpp_monto_min_anticipo'
  })
  monto_minimo_anticipo?: number;

  @property({
    type: 'number',
    name: 'bpp_monto_min_cuota'
  })
  monto_minimo_cuota?: number;

  @property({
    type: 'number',
    name: 'bpp_monto_min_deuda'
  })
  monto_minimo_deuda?: number;

  @property({
    type: 'number',
    name: 'bpp_porcentaje_anticipo'
  })
  porcentaje_anticipo?: number;

  @property({
    type: 'string',
    name: 'bpp_rdl_id'
  })
  rdl_id?: string;


  constructor(data?: Partial<ParamPlan>) {
    super(data);
  }
}

export interface ParamPlanRelations {
  // describe navigational properties here
}

export type ParamPlanWithRelations = ParamPlan & ParamPlanRelations;
