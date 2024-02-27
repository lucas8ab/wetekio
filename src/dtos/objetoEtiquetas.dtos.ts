import { Entity, model, property } from '@loopback/repository';

@model()
export class ObjetoEtiquetasDTO extends Entity {

  @property({
    type: 'string',
  })
  sujeto_id: string;

  @property({
    type: 'string',
  })
  tipo_objeto: string;

  @property({
    type: 'string',
  })
  etiqueta: string;
}
