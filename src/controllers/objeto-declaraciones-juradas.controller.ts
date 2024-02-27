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
  DeclaracionesJuradas,
} from '../models';
import { ObjetoRepository } from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class ObjetoDeclaracionesJuradasController {
  constructor(
    @repository(ObjetoRepository) protected objetoRepository: ObjetoRepository,
  ) { }

  @get('/objetos/{id}/declaraciones-juradas', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Declaraciones Juradas del Objeto',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(DeclaracionesJuradas) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<DeclaracionesJuradas>,
  ): Promise<DeclaracionesJuradas[]> {
    return this.objetoRepository.declaracionesJuradas(id).find(filter);
  }
}
