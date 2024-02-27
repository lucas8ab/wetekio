import { Entity, model, property } from '@loopback/repository';

@model({ name: 'buc_domicilios_objeto' })
export class DomicilioObjeto extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'bdo_dom_id'
  })
  id: string;

  @property({
    type: 'string',
    name: 'bdo_calle',
  })
  calle?: string;

  @property({
    type: 'string',
    name: 'bdo_kilometro',
  })
  kilometro?: string;

  @property({
    type: 'string',
    name: 'bdo_torre',
  })
  torre?: string;

  @property({
    type: 'string',
    name: 'bdo_piso',
  })
  piso?: string;

  @property({
    type: 'string',
    name: 'bdo_dpto',
  })
  dpto?: string;

  @property({
    type: 'string',
    name: 'bdo_puerta',
  })
  puerta?: string;

  @property({
    type: 'string',
    name: 'bdo_tipo',
  })
  tipo?: string;

  @property({
    type: 'string',
    name: 'bdo_lote',
  })
  lote?: string;

  @property({
    type: 'string',
    name: 'bdo_manzana',
  })
  manzana?: string;

  @property({
    type: 'string',
    name: 'bdo_barrio',
  })
  barrio?: string;

  @property({
    type: 'string',
    name: 'bdo_localidad',
  })
  localidad?: string;

  @property({
    type: 'string',
    name: 'bdo_estado',
  })
  estado?: string;

  @property({
    type: 'string',
    name: 'bdo_provincia',
  })
  provincia?: string;

  @property({
    type: 'string',
    name: 'bdo_codigo_postal',
  })
  codigo_postal?: string;

  @property({
    type: 'string',
    name: 'bdo_suj_identificador',
  })
  sujeto_id?: string;

  @property({
    type: 'string',
    name: 'bdo_soj_identificador',
  })
  objeto_id?: string;

  @property({
    type: 'string',
    name: 'bdo_soj_tipo_objeto',
  })
  objeto_tipo?: string;


  constructor(data?: Partial<DomicilioObjeto>) {
    super(data);
  }
}

export interface DomicilioObjetoRelations {
  // describe navigational properties here
}

export type DomicilioObjetoWithRelations = DomicilioObjeto & DomicilioObjetoRelations;
