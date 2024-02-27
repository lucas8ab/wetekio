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
  Exenciones,
} from '../models';
import { ObjetoRepository } from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class ObjetoExencionesController {
  constructor(
    @repository(ObjetoRepository) protected objetoRepository: ObjetoRepository,
  ) { }

  @get('/objetos/{id}/exenciones', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Exenciones del Objeto',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Exenciones) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Exenciones>,
  ): Promise<Exenciones[]> {
    return this.objetoRepository.exenciones(id).find(filter);
  }
}
