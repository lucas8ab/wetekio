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
  PlanesPago,
} from '../models';
import { SujetoRepository, PlanesPagoRepository } from '../repositories';
import { inject } from '@loopback/core';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class SujetoPlanesPagoController {
  constructor(
    @repository(SujetoRepository)
    protected sujetoRepository: SujetoRepository,
    @repository(PlanesPagoRepository)
    protected planesPagoRepository: PlanesPagoRepository,
    @inject('cuitRepresentado') private cuitRepresentado: string
  ) { }

  @post('/planes-pagos', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Registro de plan de pago',
        content: {'application/json': {schema: getModelSchemaRef(PlanesPago)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlanesPago, {
            title: 'NewPlanesPago',
            exclude: ['id','estado','fechaActDeuda','fechaEmision', 'datosAdicionales'],
          }),
        },
      },
    })
    planesPago: Omit<PlanesPago, 'id'>,
  ): Promise<any> {
    return await this.planesPagoRepository.createPlanPago(planesPago);
  }

  @get('/sujetos/{id}/planes-pagos', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista Planes de Pago del Sujeto',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(PlanesPago) },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<PlanesPago>,
  ): Promise<PlanesPago[]> {
    return this.sujetoRepository.planesPagos(this.cuitRepresentado).find(filter);
  }
}
