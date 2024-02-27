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
  DomicilioObjeto,
} from '../models';
import { ObjetoRepository } from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class ObjetoDomicilioObjetoController {
  constructor(
    @repository(ObjetoRepository) protected objetoRepository: ObjetoRepository,
  ) { }

  @get('/objetos/{id}/domicilios', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de domicilios del Sujeto',
        content: { 'application/json': { schema: getModelSchemaRef(DomicilioObjeto) } },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<DomicilioObjeto>,
  ): Promise<DomicilioObjeto[]> {
    return this.objetoRepository.domicilios(id).find(filter);
  }
}
