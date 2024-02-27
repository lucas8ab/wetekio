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
  Juicios,
} from '../models';
import { ObjetoRepository } from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class ObjetoJuiciosController {
  constructor(
    @repository(ObjetoRepository) protected objetoRepository: ObjetoRepository,
  ) { }

  @get('/objetos/{id}/juicios', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Juicios del Objeto',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Juicios) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Juicios>,
  ): Promise<Juicios[]> {
    return this.objetoRepository.juicios(id).find(filter);
  }
}
