import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  EtapasProc,
  Juicios,
} from '../models';
import { EtapasProcRepository } from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class EtapasProcJuiciosController {
  constructor(
    @repository(EtapasProcRepository)
    public etapasProcRepository: EtapasProcRepository,
  ) { }

  @get('/etapas-procesales/{id}/juicios', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Juicio que pertence a una etapa procesal',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Juicios) },
          },
        },
      },
    },
  })
  async getJuicios(
    @param.path.string('id') id: typeof EtapasProc.prototype.id,
  ): Promise<Juicios> {
    return this.etapasProcRepository.juicios(id);
  }
}
