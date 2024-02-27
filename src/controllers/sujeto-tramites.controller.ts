import {Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  put,
  HttpErrors,
} from '@loopback/rest';
import {Tramite} from '../models';
import {SujetoRepository, TramitesRepository, ParamTramiteRepository} from '../repositories';
import {intercept, inject} from '@loopback/core';
import {fileURLToPath} from 'url';
import {TramiteService} from '../services/tramite.service';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {toUpper} from 'lodash';
import {KafkaService} from '../services';
export class SujetoTramitesController {
  constructor(
    @repository(SujetoRepository)
    protected sujetoRepository: SujetoRepository,
    @repository(TramitesRepository)
    protected tramitesRepository: TramitesRepository,
    @repository(ParamTramiteRepository)
    public paramTramiteRepository : ParamTramiteRepository,
    @inject('services.TramiteService')
    private tramiteService: TramiteService,
    @inject('services.KafkaService')
    private kafkaService: KafkaService,
    @inject('id') private id: string,
    @inject('grupo') private grupo: string[],
    @inject('cuitRepresentado') private cuitRepresentado: string,
    @inject('isBackOffice') private isBackOffice: boolean,
    @inject('token') private token: string,
    @inject('usuarioTipoId') private usuarioTipoId: number,
    ) {}

  @post('/sujetos/{id}/tramites', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Crea un nuevo tramite.',
        content: {'application/json': {schema: getModelSchemaRef(Tramite)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tramite, {
            partial: true,
            exclude: ['fechaInicio', 'sujeto_id'],
          }),
        },
      },
    })
    tramite: Omit<Tramite, 'id'>,
    @param.path.string('id') id: string,
  ): Promise<Tramite> {
    console.log('acceso a create - sujeto-tramite.controller- param tramite: ', tramite)
    tramite.sujeto_id = this.cuitRepresentado;
    const newTramite = await this.tramitesRepository.createTramite(tramite);
    await this.kafkaService.produceTramite(newTramite);
    console.log('acceso a create - sujeto-tramite.controller - newTramite: ', newTramite)
    return newTramite;
  }

  @get('/sujetos/{id}/tramites', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Tramites del Sujeto',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tramite)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Tramite>,
  ): Promise<Tramite[]> {
    //fix TDR token:
    if(!this.cuitRepresentado)
      this.cuitRepresentado = '0';
    
    const tramites: Tramite[] = await this.sujetoRepository
      .tramites(this.cuitRepresentado)
      .find(filter);
    
      //fix nombre tramite
      //@ts-ignore
      const paramTramites = await this.paramTramiteRepository.find({
        fields: {id: true, tipo: true, nombre: true},
        where: {
          //@ts-ignore
          id: { inq: tramites.map(t => t.tipo) }
        }
      });

      tramites.map(t => {
        return Object.assign(t, {
          //@ts-ignore
          paramTramite: (paramTramites.filter(pt => pt.id == t.tipo))[0],
        })
      });

      //fix TDR token:
      if(!this.grupo) {
        if(this.usuarioTipoId==1)
          this.grupo = ["Contribuyente"];
        if(this.usuarioTipoId==2)
          this.grupo = ["Sistemas", "Comunicacion", "Cobranzas", "Agente"];
      }
    const parseGroup = this.grupo.map((g: string) => toUpper(g));

    return tramites.map((t: any) => {
      let tramiteParse: Tramite = {...t};
      tramiteParse.permiteCompletarStep =
        (t.datos_adicionales &&
          t.datos_adicionales.grupo &&
          parseGroup.includes(toUpper(t.datos_adicionales.grupo))) ??
        false;
      return tramiteParse;
    });
  }

  @put('/sujetos/{id}/tramites/{tramite_id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Tramite actualizado.',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @param.path.string('tramite_id') tramiteId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tramite, {
            partial: true,
            exclude: [
              'id',
              'fechaInicio',
              'referencia',
              'tipo',
              'workflowInstanceKey',
              'sujeto_id',
            ],
          }),
        },
      },
    })
    tramite: Tramite,
  ): Promise<any> {
    tramite.sujeto_id = this.cuitRepresentado;
    const updateTramite = await this.tramitesRepository.updateTramite(
      tramiteId,
      tramite,
    );
    await this.kafkaService.produceTramite(updateTramite);
    return updateTramite;
  }

  @post('/tramites/instancias/{instancia_id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Tramite actualizado.',
      },
    },
  })
  async updateByInstanciaId(
    @param.path.string('instancia_id') instancia_id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tramite, {
            partial: true,
            exclude: [
              'id',
              'fechaInicio',
              'referencia',
              'tipo',
              'workflowInstanceKey',
              'sujeto_id',
            ],
          }),
        },
      },
    })
    tramite: Tramite,
  ): Promise<any> {
    console.log('acceso a updateByInstanciaId - sujeto-tramites.controller - instancia_id: ', instancia_id)
    console.log('acceso a updateByInstanciaId - sujeto-tramites.controller - tramite: ', tramite)
    const updateTramite = await this.tramitesRepository.updateTramiteByWorkflowInstanceKey(
      instancia_id,
      tramite,
    );
    console.log('acceso a updateByInstanciaId - sujeto-tramites.controller - updateTramite: ', updateTramite)
    await this.kafkaService.produceTramite(updateTramite);

    return updateTramite;
  }

  @put('/tramites/{tramite_id}/enriquecer', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Tramite actualizado.',
      },
    },
  })
  async enriquecer(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Object),
        },
      },
    })
    body: Object,
    @param.path.string('tramite_id', {required: true}) tramiteId: string,
  ): Promise<any> {
    const updateTramite = this.tramitesRepository.updateDatosExtra(
      tramiteId,
      body,
    );
    await this.kafkaService.produceTramite(updateTramite);

    return updateTramite;
  }

  @get('/tramites', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Tramites',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tramite)},
          },
        },
      },
    },
  })
  async findAll(
    @param.query.object('filter') filter?: Filter<Tramite>,
  ): Promise<Tramite[]> {
    return this.tramitesRepository.find(filter);
  }

  @get('/tramites/tareas', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de Tareas de los tramites',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tramite)},
          },
        },
      },
    },
  })
  async findAllTareas(
    @param.query.object('filter') filter: Filter<Tramite>,
    @param.query.string('id') id: string,
  ): Promise<Tramite[]> {
    //@ts-ignore
    let all: boolean = filter ? filter.all == 'true' : false;

    //fix TDR token:
    if(!this.grupo) {
      if(this.usuarioTipoId==1)
        this.grupo = ["Contribuyente"];
      if(this.usuarioTipoId==2)
        this.grupo = ["Sistemas", "Comunicacion", "Cobranzas", "Agente"];
    }

    return await this.tramiteService.getTareas(this.id, this.grupo, all);
  }

  @put('/tramites/{tramite_id}/solicitar', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Asignar tramite para procesar.',
      },
    },
  })
  async asignarTarea(
    @param.path.string('tramite_id', {required: true}) tramiteId: string,
  ): Promise<any> {
    const updateTramite = await this.tramiteService.asignarTarea(
      tramiteId,
      this.id,
    );
    await this.kafkaService.produceTramite(updateTramite);

    return updateTramite;
  }

  @post('/tramites/{tramite_id}/completar', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'Asignar tramite para procesar.',
      },
    },
  })
  async completarTarea(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Object),
        },
      },
    })
    body: Object,
    @param.path.string('tramite_id', {required: true}) tramiteId: string,
  ): Promise<any> {
    console.log('acceso a completarTarea - sujeto-tramite.controller -  param tramiteId: ', tramiteId)
    console.log('acceso a completarTarea - sujeto-tramite.controller -  param body: ', body)
    const updateTramite = await this.tramiteService.completarTarea(
      tramiteId,
      body,
      this.id,
      this.token,
    );
    await this.kafkaService.produceTramite(updateTramite);

    return updateTramite;
  }

  @get('/tramites/{tramite_id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Tramite realizado del contribuyente',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tramite)},
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('tramite_id', {required: true}) tramiteId: string,
  ): Promise<Tramite> {
    const tramite = await this.tramitesRepository.findById(tramiteId);
    if (!this.isBackOffice && tramite.sujeto_id != this.cuitRepresentado)
      throw new HttpErrors.Unauthorized(
        `No tiene los permisos para acceder al tramite solicitado`,
      );
    return tramite;
  }
}
