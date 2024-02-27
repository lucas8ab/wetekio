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
import { SujetoRepository } from '../repositories';
import { inject } from '@loopback/core';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class SujetoSubastasController {
  constructor(
    @repository(SujetoRepository) protected sujetoRepository: SujetoRepository,
    @inject('cuitRepresentado') private cuitRepresentado: string
  ) { }

  @get('/sujetos/{id}/subastas', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Subastas del Sujeto',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Subastas) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Subastas>,
  ): Promise<Subastas[]> {
    return this.sujetoRepository.subastas(this.cuitRepresentado).find(filter);
  }
}
