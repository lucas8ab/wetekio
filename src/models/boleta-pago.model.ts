import {Entity, model, property} from '@loopback/repository';
import { Obligacion } from './obligacion.model';

@model({name: 'buc_boleta_pago'})
export class BoletaPago extends Entity {
  @property({
    type: 'string',
    id: true,
    name: 'bbp_id',
    generated: true
  })
  id?: string;

  @property({
    type: 'string',
    name: 'bbp_numero'
  })
  numero: string;

  @property({
    type: 'string',
    name: 'bbp_suj_identificador'
  })
  sujeto_id: string;

  @property({
    type: 'string',
    name: 'bbp_medio_pago'
  })
  medio_pago: string;

  @property({
    type: 'array',
    itemType: Obligacion,
    name: 'bbp_obligaciones',
  })
  obligaciones: Obligacion[];

  @property({
    type: 'date',
    name: 'bbp_fecha'
  })
  fecha?: string;

  @property({
    type: 'string',
    name: 'bbp_estado_id'
  })
  estado_id?: string;

  @property({
    type: 'string',
    name: 'bbp_estado_descripcion'
  })
  estado_descripcion?: string;

  @property({
    type: 'string',
    name: 'bbp_importe'
  })
  importe: string;

  constructor(data?: Partial<BoletaPago>) {
    super(data);
  }
}

export interface BoletaPagoRelations {
  // describe navigational properties here
}

export type BoletaPagoWithRelations = BoletaPago & BoletaPagoRelations;
