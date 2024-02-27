import { Entity, model, property } from '@loopback/repository';

@model({ name: 'buc_domicilios_sujeto' })
export class DomicilioSujeto extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'bds_dom_id'
  })
  id: string;

  @property({
    type: 'string',
    name: 'bds_calle',
  })
  calle?: string;

  @property({
    type: 'string',
    name: 'bds_kilometro',
  })
  kilometro?: string;

  @property({
    type: 'string',
    name: 'bds_torre',
  })
  torre?: string;

  @property({
    type: 'string',
    name: 'bds_piso',
  })
  piso?: string;

  @property({
    type: 'string',
    name: 'bds_dpto',
  })
  dpto?: string;

  @property({
    type: 'string',
    name: 'bds_puerta',
  })
  puerta?: string;

  @property({
    type: 'string',
    name: 'bds_tipo',
  })
  tipo?: string;

  @property({
    type: 'string',
    name: 'bds_lote',
  })
  lote?: string;

  @property({
    type: 'string',
    name: 'bds_manzana',
  })
  manzana?: string;

  @property({
    type: 'string',
    name: 'bds_barrio',
  })
  barrio?: string;

  @property({
    type: 'string',
    name: 'bds_localidad',
  })
  localidad?: string;

  @property({
    type: 'string',
    name: 'bds_estado',
  })
  estado?: string;

  @property({
    type: 'string',
    name: 'bds_provincia',
  })
  provincia?: string;

  @property({
    type: 'string',
    name: 'bds_codigo_postal',
  })
  codigo_postal?: string;

  @property({
    type: 'string',
    name: 'bds_suj_identificador',
  })
  sujeto_id?: string;


  constructor(data?: Partial<DomicilioSujeto>) {
    super(data);
  }
}

export interface DomicilioSujetoRelations {
  // describe navigational properties here
}

export type DomicilioSujetoWithRelations = DomicilioSujeto & DomicilioSujetoRelations;
