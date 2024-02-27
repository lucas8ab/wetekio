import {Entity, model, property, hasMany} from '@loopback/repository';
import {Obligacion} from './obligacion.model';
import moment = require('moment');

@model({ name: 'buc_relaciones_terceros' })
export class ObjetosTerceros extends Entity {
  @property({
    type: 'string',
    name: 'brt_obj_identificador',
    id: true,
    generated: false,
    })
  objeto_id: string;

  @property({
    type: 'string',
    name: 'brt_suj_identificador'
  })
  sujeto_id: string;

  @property({
    type: 'string',
    name: 'brt_tipo_objeto',
  })
  tipo_objeto: string;

  @property({
    type: 'date',
    name: 'brt_fecha_alta',
    default: moment().format('YYYY-MM-DD'),
  })
  fecha_alta?: string;

  @property({
    type: 'date',
    name: 'brt_fecha_baja',
    default: undefined,
  })
  fecha_baja?: string;

  @property({
    type: 'boolean',
    name: 'brt_asociado',
    default: true,
  })
  asociado?: boolean;

  @property({
    type: 'string',
    name: 'brt_etiquetas'
  })
  etiquetas?: string;

  @property({
    type: 'string',
    name: 'brt_obj_descripcion'
  })
  descripcion?: string;

  @property({
    type: 'string',
    name: 'brt_tercero_id'
  })
  tercero_id?: string;
  
  @hasMany(() => Obligacion, {keyTo: 'objeto_id'})
  obligacionTercero: Obligacion[];

  constructor(data?: Partial<ObjetosTerceros>) {
    super(data);
  }
}

export interface ObjetosTercerosRelations {
  // describe navigational properties here
}

export type ObjetosTercerosWithRelations = ObjetosTerceros & ObjetosTercerosRelations;
