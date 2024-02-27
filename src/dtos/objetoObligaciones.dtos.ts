import { Entity, model, property, hasMany, hasOne } from '@loopback/repository';
import { Obligacion } from './obligacion.dtos';
import { Exenciones } from './exenciones.dtos';

@model()
export class Objeto extends Entity {
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
  tipo?: string;

  @property({
    type: 'string',
  })
  categoria?: string;

  @property({
    type: 'string',
  })
  descripcion?: string;

  @property({
    type: 'string',
  })
  estado?: string;

  @property({
    type: 'date',
  })
  fecha_fin?: string;

  @property({
    type: 'date',
  })
  fecha_inicio?: string;

  @property({
    type: 'number',
  })
  saldo?: number;

  @property({
    type: 'number',
  })
  base_imponible?: number;

  @property({
    type: 'string',
  })
  etiquetas?: string;

  @property({
    type: 'string',
  })
  id_externo?: string;

  @property({
    type: 'Object',
  })
  datos_adicionales?: string;

  @hasMany(() => Obligacion)
  obligaciones?: Obligacion[];

  @hasMany(() => Exenciones)
  exenciones?: Exenciones[];
}
