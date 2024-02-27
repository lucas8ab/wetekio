import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Sujeto,
  BoletaPago,
} from '../models';
import {SujetoRepository} from '../repositories';
import { inject } from '@loopback/core';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class SujetoBoletaPagoController {
  constructor(
    @repository(SujetoRepository) protected sujetoRepository: SujetoRepository,
    @inject('cuitRepresentado') private cuitRepresentado: string
  ) { }

  @get('/sujetos/{id}/boleta-pagos', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Sujeto has many BoletaPago',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(BoletaPago)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<BoletaPago>,
  ): Promise<BoletaPago[]> {
    return this.sujetoRepository.boleta_pagos(this.cuitRepresentado).find(filter);
  }
}
