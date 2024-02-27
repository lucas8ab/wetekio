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
  DomicilioSujeto,
} from '../models';
import { SujetoRepository } from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { inject } from '@loopback/core';

export class SujetoDomicilioSujetoController {
  constructor(
    @repository(SujetoRepository) protected SujetoRepository: SujetoRepository,
    @inject('cuitRepresentado') private cuitRepresentado: string
  ) { }

  @get('/sujetos/{id}/domicilios', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de domicilios del Sujeto',
        content: {
          'application/json': {
            schema: getModelSchemaRef(DomicilioSujeto)
          }
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<DomicilioSujeto>,
  ): Promise<DomicilioSujeto[]> {
    return this.SujetoRepository.domicilios(this.cuitRepresentado).find(filter);
  }
}
