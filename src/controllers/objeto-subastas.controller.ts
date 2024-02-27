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
  Subastas,
} from '../models';
import {ObjetoRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class ObjetoSubastasController {
  constructor(
    @repository(ObjetoRepository) protected objetoRepository: ObjetoRepository,
  ) { }

  @get('/objetos/{id}/subastas', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Subastas del Objeto',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Subastas)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Subastas>,
  ): Promise<Subastas[]> {
    return this.objetoRepository.subastas(id).find(filter);
  }
}
