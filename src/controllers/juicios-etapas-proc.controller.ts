import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
} from '@loopback/rest';
import {
  EtapasProc,
} from '../models';
import { JuiciosRepository } from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class JuiciosEtapasProcController {
  constructor(
    @repository(JuiciosRepository) protected juiciosRepository: JuiciosRepository,
  ) { }

  @get('/juicios/{id}/etapas-procesales', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Etapas Procesales del Juicio',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(EtapasProc) },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<EtapasProc>,
  ): Promise<EtapasProc[]> {
    return this.juiciosRepository.etapasJuicio(id).find(filter);
  }
}
