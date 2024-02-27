import { Entity, model, property, hasMany } from '@loopback/repository';
import { Objeto } from './objetoObligaciones.dtos';
@model()
export class SujetoObjetosDTO extends Entity {
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
  categoria?: string;

  @property({
    type: 'string',
  })
  denominacion?: string;

  @property({
    type: 'string',
  })
  tipo?: string;

  @property({
    type: 'string',
  })
  direccion?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  telefono?: string;

  @property({
    type: 'number',
  })
  saldo?: number;

  @property({
    type: 'string',
  })
  domicilio_fiscal?: string;

  @property({
    type: 'string',
  })
  riesgo_fiscal?: string;

  @property({
    type: 'string',
  })
  situacion_fiscal?: string;

  @property({
    type: 'string',
  })
  id_externo?: string;

  @property({
    type: 'Object',
  })
  datos_adicionales?: string;

  @hasMany(() => Objeto)
  objetos: Objeto[];


  constructor(data?: Partial<SujetoObjetosDTO>) {
    super(data);
  }
}
