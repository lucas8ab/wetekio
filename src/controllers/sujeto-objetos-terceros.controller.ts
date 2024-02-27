import {
  repository, EntityNotFoundError,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  put,
} from '@loopback/rest';
import {
  ObjetosTerceros, Objeto
} from '../models';
import {SujetoRepository, ObjetosTercerosRepository, ObjetoRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { inject } from '@loopback/core';

export class SujetoObjetosTercerosController {
  constructor(
    @repository(SujetoRepository) protected sujetoRepository: SujetoRepository,
    @repository(ObjetosTercerosRepository) public objetosTercerosRepository : ObjetosTercerosRepository,
    @repository(ObjetoRepository) protected objetoRepository: ObjetoRepository,
    @inject('cuitRepresentado') private cuitRepresentado: string
  ) { }

  @get('/sujetos/{id}/objetos-terceros', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de objetos de terceros asociados al sujeto.',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ObjetosTerceros)},
          },
        },
      },
    },
  })
  async getById(
    @param.path.string('id') id: string,
    ): Promise<any> {
      return await this.objetosTercerosRepository.find({
        where: {
          sujeto_id: this.cuitRepresentado,
          asociado: true
        }
    });
  }

  @post('/sujetos/{id}/objetos-terceros', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Crea una asociacion entre el sujeto y un objeto de tercero.',
        content: {'application/json': {schema: getModelSchemaRef(ObjetosTerceros)}},
      },
    },
  })
  async create(
    @param.path.string('id') sujeto_id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ObjetosTerceros, {
            exclude: ['fecha_alta', 'fecha_baja', 
            'asociado','descripcion','sujeto_id'],
          }),
        },
      },
    })
    terceros: ObjetosTerceros,
  ): Promise<ObjetosTerceros> {
    var objetoTercero = await this.objetoRepository.findOne({
      where: {
        id: terceros.objeto_id,
        tipo: terceros.tipo_objeto,
        sujeto_id: terceros.tercero_id
      }
    });
    if(!objetoTercero)
      throw new EntityNotFoundError(Objeto, 'tercero_id, objeto_id y/o tipo_objeto');

    terceros.sujeto_id = this.cuitRepresentado;
    terceros.descripcion = objetoTercero.descripcion;
    return this.objetosTercerosRepository.create(terceros);
  }

  @put('/sujetos/{id}/objetos-terceros/etiquetas', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Actualiza la etiqueta.',
      },
    },
  })
  async updateTag(
    @param.path.string('id') sujeto_id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ObjetosTerceros, {
            exclude: ['sujeto_id', 'descripcion', 'asociado',
            'tercero_id','fecha_alta', 'fecha_baja'],
          }),
        },
      },
    }
    ) terceros: ObjetosTerceros,
    ): Promise<any> {
    return await this.objetosTercerosRepository.setEtiqueta(this.cuitRepresentado, terceros);
  }

  @put('/sujetos/{id}/objetos-terceros/activar', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Da de alta una asociacion existente.',
      },
    },
  })
  async updateTercero(
    @param.path.string('id') sujeto_id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ObjetosTerceros, {
            exclude: ['sujeto_id', 'descripcion', 'etiquetas',
            'tercero_id', 'fecha_alta', 'fecha_baja', 'asociado']
          }),
        },
      },
    }
    ) terceros: ObjetosTerceros,
    ): Promise<any> {
    return await this.objetosTercerosRepository.activaTercero(this.cuitRepresentado, terceros);
  }

  @del('/sujetos/{id}/objetos-terceros', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Establece la baja sobre la asociacion de un tercero.',
      },
    },
  })
  async deleteByManyId( 
    @param.path.string('id') sujeto_id: string,
    @param.query.string('objeto_id') objeto_id: string,
    @param.query.string('tipo_objeto') tipo_objeto: string,
  ): Promise<void> {
    await this.objetosTercerosRepository.deleteTercero(this.cuitRepresentado, objeto_id, tipo_objeto);
  }
}
