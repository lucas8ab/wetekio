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
  Sujeto,
  ActividadesSujeto,
} from '../models';
import { SujetoRepository } from '../repositories';
import moment = require('moment');
import { inject } from '@loopback/core';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class SujetoActividadesSujetoController {
  constructor(
    @repository(SujetoRepository) protected sujetoRepository: SujetoRepository,
    @inject('cuitRepresentado') private cuitRepresentado: string
  ) { }

  @get('/sujetos/{id}/actividades', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Actividades del Sujeto',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(ActividadesSujeto) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<ActividadesSujeto>,
  ): Promise<ActividadesSujeto[]> {
    //@ts-ignore
    let fechaFiltro = filter && filter.fecha ? moment(filter.fecha).utc().format("YYYY-MM-DD") 
    : undefined;
    filter = fechaFiltro ? {
      where: {
        and:[
        {fecha_inicio: {lte: fechaFiltro}},
        {fecha_fin: {gte: fechaFiltro}}
        ]
      }
    }
    : {};
    return this.sujetoRepository.actividadesSujetos(this.cuitRepresentado).find(filter);
  }
}
