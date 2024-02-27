import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  put,
} from '@loopback/rest';
import {Contactos} from '../models';
import {SujetoRepository} from '../repositories';
import {ContactosRepository} from '../repositories';
import moment = require('moment');
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {inject} from '@loopback/core';
import {KafkaService} from '../services/kafka.service';

export class SujetoContactosController {
  constructor(
    @repository(SujetoRepository) protected sujetoRepository: SujetoRepository,
    @repository(ContactosRepository)
    protected contactosRepository: ContactosRepository,
    @inject('cuitRepresentado') private cuitRepresentado: string,
    @inject('services.KafkaService')
    private kafkaService: KafkaService,
  ) {}

  @get('/sujetos/contactos', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Contactos del Sujeto',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Contactos)},
          },
        },
      },
    },
  })
  async find(): Promise<Contactos[]> {
    //fix TDR token:
    if(!this.cuitRepresentado)
      this.cuitRepresentado = '0';
    return this.sujetoRepository.contactos(this.cuitRepresentado).find();
  }

  @post('sujetos/contacto', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Contacto creado.',
        content: {'application/json': {schema: getModelSchemaRef(Contactos)}},
      },
    },
  })
  async create(
    @requestBody({
      description: 'Crea un contacto para el sujeto.',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contactos, {
            partial: true,
            exclude: [
              'id',
              'sujeto_id',
              'fechaInteraccion',
              'fechaFin',
              'fechaInicio',
            ],
          }),
        },
      },
    })
    contacto: Contactos,
  ): Promise<Contactos> {
    const newContacto = await this.contactosRepository.createContacto(contacto);
    await this.kafkaService.produceContacto(newContacto);
    return newContacto;
  }

  @put('sujetos/contacto/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Contacto actualizado.',
      },
    },
  })
  async actualizaContactoById(
    @param.path.string('id') id: string,
    @requestBody({
      description: 'Actualiza un contacto.',
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contactos, {
            partial: true,
            exclude: [
              'id',
              'sujeto_id',
              'fechaInteraccion',
              'fechaInicio',
              'fechaFin',
            ],
          }),
        },
      },
    })
    contacto: Contactos,
  ): Promise<any> {
    return await this.contactosRepository.updateContacto(id, contacto);
  }

  @post('/sujetos/contacto/{id}/interaccion', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Fecha de interaccion actualizada.',
        content: {'application/json': {schema: getModelSchemaRef(Contactos)}},
      },
    },
  })
  async actualizaContactoLeido(
    @param.path.string('id') id: string,
  ): Promise<Contactos> {
    const fecha: any = {
      fechaInteraccion: moment()
        .utc(true)
        .local()
        .toISOString(),
    };
    const updateContacto = await this.contactosRepository.updateContacto(
      id,
      fecha,
    );
    await this.kafkaService.produceContacto(updateContacto);
    return updateContacto;
  }

  @post('/sujetos/contacto/{id}/fin', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Fecha de finalizacion actualizada.',
        content: {'application/json': {schema: getModelSchemaRef(Contactos)}},
      },
    },
  })
  async actualizaFecha(
    @param.path.string('id') id: string,
  ): Promise<Contactos> {
    const fecha: any = {
      fechaFin: moment()
        .utc(true)
        .local()
        .toISOString(),
    };
    const updateContacto = await this.contactosRepository.updateContacto(
      id,
      fecha,
    );
    await this.kafkaService.produceContacto(updateContacto);
    return updateContacto;
  }
}
