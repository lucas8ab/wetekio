import { Entity, model, property } from '@loopback/repository';

@model()
export class Exenciones extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
  })
  id: string;

  @property({
    type: 'string',
  })
  descripcion?: string;

  @property({
    type: 'date',
  })
  fecha_fin?: string;

  @property({
    type: 'date',
  })
  fecha_inicio?: string;

  @property({
    type: 'string',
  })
  periodo?: string;

  @property({
    type: 'number',
  })
  porcentaje?: number;

  @property({
    type: 'string',
  })
  tipo?: string;
}
