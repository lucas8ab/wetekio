import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
} from '@loopback/rest';
import { Sujeto } from '../models';
import { SujetoRepository } from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { inject } from '@loopback/core';

export class SujetoController {
  constructor(
    @repository(SujetoRepository)
    public sujetoRepository: SujetoRepository,
    @inject('cuitRepresentado') private cuitRepresentado: string,
    @inject('isBackOffice') private isBackOffice: boolean
  ) { }

  @get('/sujetos', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista del modelo instancia de Sujeto',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Sujeto) },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Sujeto)) filter?: Filter<Sujeto>,
  ): Promise<Sujeto[]> {
    return this.sujetoRepository.find(filter);
  }

  @get('/sujetos/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Modelo instancia de Sujeto',
        content: { 'application/json': { schema: getModelSchemaRef(Sujeto) } },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Sujeto> {
    let cuit = this.cuitRepresentado;
    if(this.isBackOffice)
      cuit = id;
    return this.sujetoRepository.findById(cuit);
  }
}
