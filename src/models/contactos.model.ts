import { Entity, model, property } from '@loopback/repository';

@model({ name: 'buc_contactos' })
export class Contactos extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    name: 'bct_ctc_id'
  })
  id: string;

  @property({
    type: 'string',
    name: 'bct_archivo'
  })
  archivo?: string;

  @property({
    type: 'string',
    name: 'bct_descripcion'
  })
  descripcion?: string;

  @property({
    type: 'date',
    name: 'bct_fecha_inicio'
  })
  fechaInicio?: string;

  @property({
    type: 'object',
    cassandra: {columnName: 'bct_otros_atributos', dataType: 'map<text, text>'},    
  })
  datos_adicionales?: object;

  @property({
    type: 'string',
    name: 'bct_tipo'
  })
  tipo?: string;

  @property({
    type: 'string',
    name: 'bct_suj_identificador'
  })
  sujeto_id?: string;

  @property({
    type: 'date',
    name: 'bct_fecha_interaccion'
  })
  fechaInteraccion?: string;

  @property({
    type: 'date',
    name: 'bct_fecha_fin'
  })
  fechaFin?: string;

  @property({
    type: 'string',
    name: 'bct_subtipo'
  })
  subtipo?: string;

  @property({
    type: 'string',
    name: 'bct_agente'
  })
  agente?: string;

  @property({
    type: 'string',
    name: 'bct_representado'
  })
  representado?: string;

  constructor(data?: Partial<Contactos>) {
    super(data);
  }
}

export interface ContactosRelations {
  // describe navigational properties here
}

export type ContactosWithRelations = Contactos & ContactosRelations;
