import {Entity, model, property} from '@loopback/repository';

@model({name: 'buc_param_tramite'})
export class ParamTramite extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  descripcion?: string;

  @property({
    type: 'date',
    name: 'fecha_alta',
    default: new Date()
  })
  fechaAlta?: string;

  @property({
    type: 'date',
    name: 'fecha_baja'
  })
  fechaBaja?: string;

  @property({
    type: 'string',
  })
  formulario?: string;

  @property({
    type: 'string',
  })
  nombre?: string;

  @property({
    type: 'string',
  })
  segmento?: string;

  @property({
    type: 'string',
  })
  tipo: string;

  @property({
    type: 'string',
    name: 'url_adjuntos'
  })
  urlAdjuntos: string;

  @property({
    type: 'string',
    name: 'configuracion_url_adjuntos'
  })
  configuracionUrlAdjuntos: string;

  @property({
    type: 'string',
    name: 'url_endpoint'
  })
  urlEndpoint?: string;

  @property({
    type: 'string',
    name: 'usuario_baja'
  })
  usuarioBaja?: string;

  @property({
    type: 'string',
    name: 'url_externa',
    default: ''
  })
  urlExterna?: string;

  @property({
    type: 'boolean',
    name: 'visualizar_tramite'
  })
  visualizarTramite?: boolean;


  constructor(data?: Partial<ParamTramite>) {
    super(data);
  }
}

export interface ParamTramiteRelations {
  // describe navigational properties here
}

export type ParamTramiteWithRelations = ParamTramite & ParamTramiteRelations;
