import {BelongsToAccessor, DefaultCrudRepository, EntityNotFoundError, repository} from '@loopback/repository';
import {ParamTramite, Tramite, TramitesRelations} from '../models';
import {CassandraBucDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import moment = require('moment');
import {v4 as uuid} from 'uuid';
import { ParamTramiteRepository } from './param-tramite.repository';

export class TramitesRepository extends DefaultCrudRepository<
  Tramite,
  typeof Tramite.prototype.id,
  TramitesRelations
> {

  public readonly paramTramite: BelongsToAccessor<ParamTramite, typeof Tramite.prototype.id>;

  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
    @repository.getter('ParamTramiteRepository') 
    protected paramTramiteRepositoryGetter: Getter<ParamTramiteRepository>,
    @repository(ParamTramiteRepository)
    private paramTramiteRepository: ParamTramiteRepository,
  ) {
    super(Tramite, dataSource);
    this.paramTramite = this.createBelongsToAccessorFor('paramTramite', paramTramiteRepositoryGetter);
    this.registerInclusionResolver('paramTramite', this.paramTramite.inclusionResolver);
  }

  async findByIdAndSujeto(id: string, sujetoId: string) {
    return await this.findOne({
      where: {
        and: [{id: id}, {sujeto_id: sujetoId}],
      },
    });
  }

  async findByWorkflowInstanciaKey(id: string) {
    return await this.findOne({
      where: {
        workflowInstanceKey: id,
      },
    });
  }

  async createTramite(tramite: any): Promise<Tramite> {
    console.log('acceso a createTramite - tramite.repository - param tramite: ', tramite)
    tramite.id = tramite.id ? tramite.id : uuid();
    tramite.fechaInicio = moment().format('YYYY-MM-DD HH:mm:ss');
    tramite.archivos = tramite.archivos ? tramite.archivos : {};
    tramite.datos_adicionales = tramite.datos_adicionales
      ? tramite.datos_adicionales
      : {};

    if (tramite.datos_adicionales && tramite.datos_adicionales['datos_extra'])
      tramite.datos_adicionales['datos_extra'] = tramite.datos_adicionales[
        'datos_extra'
      ].replace(/"/g, "''");
    console.log('createTramite - tramite.repository - antes de consultar - param tramite: ', tramite)

    let query = `INSERT INTO read_side.buc_tramites (btr_suj_identificador, btr_trm_id,
      btr_archivos,btr_descripcion, btr_estado, btr_fecha_inicio, btr_otros_atributos,
      btr_referencia, btr_tipo, btr_workflow_instance_key) 
      values('${tramite.sujeto_id}','${tramite.id}',
      ${JSON.stringify(tramite.archivos).replace(/"/g, "'")},
      '${tramite.descripcion}','${tramite.estado}','${tramite.fechaInicio}',
      ${JSON.stringify(tramite.datos_adicionales)
        .replace(/"/g, "'")
        .replace(/''/g, '"')},
      '${tramite.referencia}', '${tramite.tipo}', '${
      tramite.workflowInstanceKey
    }')`;
    await this.execute(query, []);
    const result = await this.findByIdAndSujeto(tramite.id, tramite.sujeto_id);
    console.log('createTramite - tramite.repository - despues de consultar - result: ', result)
    if (!result) {
      throw Object.assign(new Error(), {
        message: 'El tramite no pudo ser creado.',
        code: 'Gone',
        status: 410,
      });
    }

    return result;
  }

  async updateDatosExtra(id: string, datosExtra: object): Promise<any> {
    const tramiteStored = await this.findById(id);
    if (!tramiteStored)
      return new EntityNotFoundError(Tramite, 'sujeto_id o tramite_id');

    const tramite = new Tramite({
      datos_adicionales: {
        datos_extra: JSON.stringify(datosExtra).replace(/"/g, "''"),
      },
    });
    return this.updateAttributes(tramiteStored, tramite);
  }

  async updateTramite(id: string, tramite: Tramite): Promise<any> {
    const tramiteStored: any = await this.findById(id);
    if (!tramiteStored)
      return new EntityNotFoundError(Tramite, 'sujeto_id o tramite_id');
    if (
      tramiteStored.datos_adicionales &&
      tramiteStored.datos_adicionales['datos_extra']
    )
      tramiteStored.datos_adicionales[
        'datos_extra'
      ] = tramiteStored.datos_adicionales['datos_extra'].replace(/"/g, "''");

    return this.updateAttributes(tramiteStored, tramite);
  }

  sleep(milliseconds: any) {
    const start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }
  }

  async updateTramiteByWorkflowInstanceKey(
    id: string,
    tramite: Tramite,
  ): Promise<any> {
    console.log('acceso a updateTramiteByWorkflowInstanceKey - tramites.repository - param id: ', id)
    console.log('acceso a updateTramiteByWorkflowInstanceKey - tramites.repository - param tramite: ', tramite)

    let retry = 5;
    const delay = 1000;
    let tramiteStored: any;

    while(!tramiteStored && retry ){
      console.log('Dentro del retry, intetno: ', retry)
      tramiteStored = await this.findByWorkflowInstanciaKey(id);
      retry--;
      this.sleep(delay)
    }
    console.log('acceso a updateTramiteByWorkflowInstanceKey - tramites.repository - param tramiteStored: ', tramiteStored)
    if (!tramiteStored)
      throw new EntityNotFoundError(Tramite, 'workflowInstanceKey');

    if (
      tramiteStored.datos_adicionales &&
      tramiteStored.datos_adicionales['datos_extra']
    )
      tramiteStored.datos_adicionales[
        'datos_extra'
      ] = tramiteStored.datos_adicionales['datos_extra'].replace(/"/g, "''");

    return this.updateAttributes(tramiteStored, tramite);
  }

  async updateAttributes(tramiteStored: Tramite, tramite: Tramite) {
    console.log('acceso a updateAttributes - tramites.repository - param tramiteStored: ', tramiteStored)
    console.log('acceso a updateAttributes - tramites.repository - param tramite: ', tramite)

    let estadoStored: any[] =
      tramiteStored.estado != 'undefined' &&
      tramiteStored.estado.indexOf('}') > 0
        ? JSON.parse(tramiteStored.estado)
        : [];
    let estadoUpdate: any =
      tramite.estado && tramite.estado.indexOf('}') > 0
        ? JSON.parse(tramite.estado)
        : undefined;
    tramite.descripcion = tramite.descripcion
      ? JSON.stringify(
          Object.assign(
            JSON.parse(tramiteStored.descripcion ?? '{}'),
            JSON.parse(tramite.descripcion),
          ),
        )
      : tramiteStored.descripcion;
    tramite.archivos = tramite.archivos
      ? Object.assign(tramiteStored.archivos || {}, tramite.archivos)
      : tramiteStored.archivos;
    tramite.datos_adicionales = tramite.datos_adicionales
      ? Object.assign(
          tramiteStored.datos_adicionales || {},
          tramite.datos_adicionales,
        )
      : tramiteStored.datos_adicionales;
    estadoStored =
      (estadoStored.length > 0 &&
        estadoUpdate !== undefined &&
        estadoStored[estadoStored.length - 1].proceso !==
          estadoUpdate.proceso &&
        moment(estadoStored[estadoStored.length - 1].fecha).isBefore(
          estadoUpdate.fecha,
        )) ||
      estadoStored.length === 0
        ? estadoStored.concat(estadoUpdate)
        : estadoStored;

    tramite.estado = JSON.stringify(estadoStored);
    console.log('tramite a actualizar: ', tramite);
    let query = `UPDATE read_side.buc_tramites SET 
      btr_archivos=${JSON.stringify(tramite.archivos).replace(/"/g, "'")},
      btr_descripcion='${tramite.descripcion}',
      btr_otros_atributos=${JSON.stringify(tramite.datos_adicionales)
        .replace(/"/g, "'")
        .replace(/''/g, '"')},
      btr_estado='${tramite.estado}'
      WHERE btr_suj_identificador='${tramiteStored.sujeto_id}' AND
      btr_trm_id='${tramiteStored.id}' IF EXISTS`;
    console.log(query);
    await this.execute(query, []);

    return this.findByIdAndSujeto(tramiteStored.id, tramiteStored.sujeto_id);
  }
}
