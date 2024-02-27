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
  Objeto,
} from '../models';
import { SujetoRepository } from '../repositories';
import { inject } from '@loopback/core';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class SujetoObjetoController {
  constructor(
    @repository(SujetoRepository)
    protected SujetoRepository: SujetoRepository,
    @inject('cuitRepresentado') private cuitRepresentado: string
  ) { }

  @get('/sujetos/{id}/objetos', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de objetos del Sujeto',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Objeto)
          }
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Objeto>
  ): Promise<Objeto[]> {
    let hola;
    console.log("hola tarolas", hola);
    
    return this.SujetoRepository.objetos(this.cuitRepresentado).find(filter);
  }
}
