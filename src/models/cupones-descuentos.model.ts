/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entity, model, property } from '@loopback/repository';
import CuponDetail from '../interfaces/cupones-detalles.interface';

@model({ name: 'buc_cupon_descuento' })
export class CuponesDescuentos extends Entity {

  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'bcd_obn_identificador',
  })
  obligacionId: string;

  @property({
    type: 'string',
    name: 'bcd_soj_identificador',
  })
  objetoId?: string;

  @property({
    type: 'string',
    name: 'bcd_soj_tipo_objeto',
  })
  objetoType?: string;

  @property({
    type: 'Object',
    name: 'bcd_otros_atributos',
  })
  otrosAtributos?: any;

  @property.array(Object, {
    name: 'bcd_detalles',
  })
  detalles?: CuponDetail[];

  constructor(data?: Partial<CuponesDescuentos>) {
    super(data);
  }
}

export interface CuponesDescuentosRelations {
  // describe navigational properties here
}

export type CuponesDescuentosWithRelations = CuponesDescuentos &
  CuponesDescuentosRelations;