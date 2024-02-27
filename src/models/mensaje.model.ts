import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Mensaje extends Model {
  @property({
    type: 'date',
  })
  fecha?: string;

  @property({
    type: 'string',
  })
  usuario?: string;

  @property({
    type: 'string',
  })
  mensaje?: string;

  @property({
    type: 'string',
    cassandra: {columnName: 'leidopor', dataType: 'text'},
  })
  leidopor?: string;


  constructor(data?: Partial<Mensaje>) {
    super(data);
  }
}

export interface MensajeRelations {
  // describe navigational properties here
}

export type MensajeWithRelations = Mensaje & MensajeRelations;
