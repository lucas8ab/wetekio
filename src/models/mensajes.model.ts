import {Entity, model, property} from '@loopback/repository';
import {Mensaje} from './mensaje.model';

@model({name: 'buc_mensajes', settings: {strict: false}})
export class Mensajes extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    name: 'bmj_clave'
  })
  clave: string;

  @property({
    type: 'string',
    name: 'bmj_entidad'
  })
  entidad: string;

  @property({
    type: 'array',
    itemType: Mensaje,
    name: 'bmj_mensajes',
    cassandra: {
      dataType: 'list<frozen<mensaje>>',
    },
  })
  mensajes?: Array<Mensaje>;


  constructor(data?: Partial<Mensajes>) {
    super(data);
  }
}

export interface MensajesRelations {
  // describe navigational properties here
}

export type MensajesWithRelations = Mensajes & MensajesRelations;
