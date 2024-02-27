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
import { SujetoRepository } from '../repositories';
import { inject } from '@loopback/core';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class SujetoJuiciosController {
  constructor(
    @repository(SujetoRepository) protected sujetoRepository: SujetoRepository,
    @inject('cuitRepresentado') private cuitRepresentado: string
  ) { }

  @get('/sujetos/{id}/juicios', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Juicios del Sujeto',
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
    return this.sujetoRepository.juicios(this.cuitRepresentado).find(filter);
  }
}
