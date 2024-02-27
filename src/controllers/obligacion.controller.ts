import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  requestBody,
  put,
  post,
} from '@loopback/rest';
import { Obligacion } from '../models';
import { ObligacionRepository } from '../repositories';
import { ObligacionEstadoDTO } from '../dtos/obligacionEstado.dtos';
import { BoletaPagosSpec } from './specs/boleta-pagos.specs';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { inject } from '@loopback/core';

export class ObligacionController {
  constructor(
    @repository(ObligacionRepository)
    public obligacionRepository: ObligacionRepository,
  ) { }

  @get('/obligaciones', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Obligaciones',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Obligacion) },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Obligacion)) filter?: Filter<Obligacion>,
  ): Promise<Obligacion[]> {
    return this.obligacionRepository.find(filter);
  }

  @get('/obligaciones/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Modelo instancia de Obligacion',
        content: { 'application/json': { schema: getModelSchemaRef(Obligacion) } },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Obligacion> {
    return this.obligacionRepository.findById(id);
  }

  @put('/obligaciones/{id}/estado', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Estado de la obligacion actualizada.',
      }
    },
  })
  async actualizaEstadoById(
    @param.path.string('id') id: string,
    @requestBody({
      description: "Actualiza el estado de la obligacion.",
      content: {
        'application/json': {
          schema: getModelSchemaRef(ObligacionEstadoDTO, {
            includeRelations: true
          }),
        },
      },
    })
    obligacion: ObligacionEstadoDTO,
  ): Promise<any> {
    return await this.obligacionRepository.setEstado(obligacion.estado,{
      id: id,
      sujeto_id: obligacion.sujeto_id,
      objeto_id: obligacion.objeto_id,
      tipo_objeto: obligacion.tipo_objeto
    });
  }

  @post('/obligaciones/estados/{estado}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: `Estados actualizados de las obligaciones
        pasado por parametro del path.`,
      }
    },
  })
  async actualizarEstados(
    @param.path.string('estado') estado: string,
    @requestBody({
      description: "Actualiza el estado de las obligaciones segun el paramtero.",
      content: {
        'application/json': {
          schema: getModelSchemaRef(BoletaPagosSpec),
        },
      },
    })
    boleta: BoletaPagosSpec,
  ): Promise<any> {
    return await this.obligacionRepository.actualizarEstados(boleta.detalle, estado);
  }
}
