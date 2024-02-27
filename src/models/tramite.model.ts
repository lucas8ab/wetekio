import { belongsTo, Entity, model, property } from '@loopback/repository';
import { ParamTramite } from './param-tramite.model';

@model({ name: 'buc_tramites' })
export class Tramite extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'btr_trm_id'
  })
  id: string;

  @property({
    type: 'object',
    name: 'btr_archivos'
  })
  archivos: object;

  @property({
    type: 'string',
    name: 'btr_descripcion'
  })
  descripcion?: string;

  @property({
    type: 'string',
    name: 'btr_estado'
  })
  estado: string;

  @property({
    type: 'date',
    name: 'btr_fecha_inicio'
  })
  fechaInicio?: string;

  @property({
    type: 'object',
    name: 'btr_otros_atributos'
  })
  datos_adicionales: object;

  @property({
    type: 'string',
    name: 'btr_referencia'
  })
  referencia?: string;

  @property({
    type: 'string',
    name: 'btr_tipo'
  })
  tipo?: string;

  @property({
    type: 'string',
    name: 'btr_workflow_instance_key'
  })
  workflowInstanceKey: string

  @property({
    type: 'string',
    name: 'btr_suj_identificador'
  })
  sujeto_id: string;

  permiteCompletarStep:boolean;

  @belongsTo(() => ParamTramite, {keyFrom: 'btr_tipo', name: 'paramTramite'}, {name: 'btr_tipo'})
  paramTramite: ParamTramite;

  constructor(data?: Partial<Tramite>) {
    super(data);
  }
}

export interface TramitesRelations {
  // describe navigational properties here
}

export type TramitesWithRelations = Tramite & TramitesRelations;
