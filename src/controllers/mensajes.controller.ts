import {
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Mensajes} from '../models';
import {MensajesRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class MensajesController {
  constructor(
    @repository(MensajesRepository)
    public mensajesRepository : MensajesRepository,
  ) {}

  @post('/mensajes', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Mensajes model instance',
        content: {'application/json': {schema: getModelSchemaRef(Mensajes)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mensajes, {
            title: 'NewMensajes',
            exclude: ['mensajes'],
          }),
        },
      },
    })
    mensajes: Mensajes,
  ): Promise<Mensajes> {
    return this.mensajesRepository.create(mensajes);
  }

  @get('/mensajes', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Mensajes model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Mensajes, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
  ): Promise<Mensajes[]> {
    return this.mensajesRepository.find();
  }

  @get('/mensajes/{clave}/{entidad}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Mensajes model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Mensajes, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('clave') clave: string,
    @param.path.string('entidad') entidad: string,
  ): Promise<any> {
    return await this.mensajesRepository.findOne({
      where: {
        clave: clave, 
        entidad: entidad
      }
    });
  }

  @put('/mensajes/{clave}/{entidad}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Mensajes PUT success',
      },
    },
  })
  async updateById(
    @param.path.string('clave') clave: string,
    @param.path.string('entidad') entidad: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Mensajes, {
            exclude: ['clave', 'entidad'],
          }),
        },
      },
    }) mensajes: Mensajes,
  ): Promise<any> {
    await this.mensajesRepository.findOne({
      where: {
        clave: clave, 
        entidad: entidad
      }
    });

    await this.mensajesRepository.updateAll(mensajes, {
      clave: clave,
      entidad: entidad,
    });

    return await this.mensajesRepository.findOne({
      where: {
        clave: clave, 
        entidad: entidad
      }
    });
  }

  @del('/mensajes/{clave}/{entidad}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Mensajes DELETE success',
      },
    },
  })
  async deleteById(
    @param.path.string('clave') clave: string,
    @param.path.string('entidad') entidad: string
    ): Promise<void> {
      await this.mensajesRepository.deleteAll({
          clave: clave, 
          entidad: entidad
      });
    }
}
