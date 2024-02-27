import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {BoletaPago} from '../models';
import {BoletaPagoRepository} from '../repositories';
import { ReporteBoletaDto } from './dtos/reporte-boleta.dtos';
import { inject } from '@loopback/context';
import { BoletaService } from '../services';
import { ReporteService } from '../services/reporte.service';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class BoletaPagosController {
  constructor(
    @repository(BoletaPagoRepository)
    public boletaPagoRepository : BoletaPagoRepository,
    @inject('services.BoletaService')
    private boletaService: BoletaService,
    @inject('services.ReporteService')
    private reporteService: ReporteService,
  ) {}

  @post('/boleta-pagos', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'BoletaPago model instance',
        content: {'application/json': {schema: getModelSchemaRef(BoletaPago)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BoletaPago, {
            title: 'NewBoletaPago',
            exclude: ['id','numero','fecha',
            'estado_id','estado_descripcion','importe'],
          }),
        },
      },
    })
    boletaPago: Omit<BoletaPago, 'id'>,
  ): Promise<BoletaPago> {
    return await this.boletaService.formatterBoleta(boletaPago);
  }

  @get('/boleta-pagos/count', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'BoletaPago model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(BoletaPago)) where?: Where<BoletaPago>,
  ): Promise<Count> {
    return this.boletaPagoRepository.count(where);
  }

  @get('/boleta-pagos', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of BoletaPago model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(BoletaPago, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(BoletaPago)) filter?: Filter<BoletaPago>,
  ): Promise<BoletaPago[]> {
    return this.boletaPagoRepository.find(filter);
  }

  @get('/boleta-pagos/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Obtener Boleta Pago',
        content: {
          'application/json': {
            schema: getModelSchemaRef(BoletaPago, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(BoletaPago)) filter?: Filter<BoletaPago>
  ): Promise<BoletaPago> {
    return this.boletaPagoRepository.findById(id, filter);
  }

  @get('/boleta-pagos/{id}/reporte/{formato}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Obtener boleta de pago para generar reportes',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ReporteBoletaDto, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findByIdReporte(
    @param.path.string('id') id: string,
    @param.path.string('formato', {description: 'only values: both, qrcode or barcode'}) formato: string,
  ): Promise<any> {
    return await this.reporteService.getReporte(id, formato);
  }

  @put('/boleta-pagos/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'BoletaPago PUT success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BoletaPago, {partial: true}),
        },
      },
    })
    boletaPago: BoletaPago,
  ): Promise<void> {
    await this.boletaPagoRepository.updateById(id, boletaPago);
  }

  @del('/boleta-pagos/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'BoletaPago DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.boletaPagoRepository.deleteById(id);
  }
}
