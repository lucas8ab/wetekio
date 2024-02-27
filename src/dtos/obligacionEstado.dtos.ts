import { Entity, model, property } from '@loopback/repository';

@model()
export class ObligacionEstadoDTO extends Entity {

  @property({
    type: 'string',
  })
  sujeto_id: string;

  @property({
    type: 'string',
  })
  objeto_id: string; 

  @property({
    type: 'string',
  })
  tipo_objeto: string;

  @property({
    type: 'string',
  })
  estado: string;
  
}
