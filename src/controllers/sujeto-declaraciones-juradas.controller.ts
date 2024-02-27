import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {
  DeclaracionesJuradas,
} from '../models';
import { SujetoRepository, DeclaracionesJuradasRepository } from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { inject } from '@loopback/core';

export class SujetoDeclaracionesJuradasController {
  constructor(
    @repository(SujetoRepository) protected sujetoRepository: SujetoRepository,
    @repository(DeclaracionesJuradasRepository) protected declaracionesJuradasRepository: DeclaracionesJuradasRepository,
    @inject('cuitRepresentado') private cuitRepresentado: string
  ) { }

  @get('/sujetos/{id}/declaraciones-juradas', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Declaraciones Juradas del Sujeto',
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
    let ddjj = await this.sujetoRepository.declaracionesJuradas(this.cuitRepresentado).find(filter);
    return ddjj.filter(dj => dj.estado != 'inactiva');
  }

  @post('/sujetos/{id}/declaraciones-juradas', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Crea una declaracion jurada.',
        content: {'application/json': {schema: getModelSchemaRef(DeclaracionesJuradas)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Object),
        },
      },
    })
    ddjj: DeclaracionesJuradas,
    @param.path.string('id') id: string,
  ): Promise<any> {
    ddjj.sujeto_id = this.cuitRepresentado;
    return await this.declaracionesJuradasRepository.createDDJJ(ddjj);
  }
}
