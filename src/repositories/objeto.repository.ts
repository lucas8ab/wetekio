/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-var */
import { DefaultCrudRepository, repository, HasManyRepositoryFactory, EntityNotFoundError } from '@loopback/repository';
import { Objeto, ObjetoRelations, Obligacion, DomicilioObjeto, DeclaracionesJuradas, Exenciones, Juicios, Subastas } from '../models';
import { CassandraBucDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { DomicilioObjetoRepository } from './domicilio-objeto.repository';
import { ObligacionRepository } from './obligacion.repository';
import { DeclaracionesJuradasRepository } from './declaraciones-juradas.repository';
import { ExencionesRepository } from './exenciones.repository';
import { JuiciosRepository } from './juicios.repository';
import { PlanesPagoRepository } from './planes-pago.repository';
import { SubastasRepository } from './subastas.repository';
import {ObligacionesExcepcionesRepository} from './obligaciones-excepciones.repository';

import moment = require('moment');

export class ObjetoRepository extends DefaultCrudRepository<
  Objeto,
  typeof Objeto.prototype.id,
  ObjetoRelations
  > {

  public readonly domicilios: HasManyRepositoryFactory<DomicilioObjeto, typeof Objeto.prototype.id>;

  public readonly obligaciones: HasManyRepositoryFactory<Obligacion, typeof Objeto.prototype.id>;

  public readonly declaracionesJuradas: HasManyRepositoryFactory<DeclaracionesJuradas, typeof Objeto.prototype.id>;

  public readonly exenciones: HasManyRepositoryFactory<Exenciones, typeof Objeto.prototype.id>;

  public readonly juicios: HasManyRepositoryFactory<Juicios, typeof Objeto.prototype.id>;

  public readonly subastas: HasManyRepositoryFactory<Subastas, typeof Objeto.prototype.id>;

  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource, @repository.getter('DomicilioObjetoRepository') protected domicilioObjetoRepositoryGetter: Getter<DomicilioObjetoRepository>, @repository.getter('ObligacionRepository') protected obligacionRepositoryGetter: Getter<ObligacionRepository>, @repository.getter('DeclaracionesJuradasRepository') protected declaracionesJuradasRepositoryGetter: Getter<DeclaracionesJuradasRepository>, @repository.getter('ExencionesRepository') protected exencionesRepositoryGetter: Getter<ExencionesRepository>, @repository.getter('JuiciosRepository') protected juiciosRepositoryGetter: Getter<JuiciosRepository>, @repository.getter('PlanesPagoRepository') protected planesPagoRepositoryGetter: Getter<PlanesPagoRepository>, @repository.getter('SubastasRepository') protected subastasRepositoryGetter: Getter<SubastasRepository>, @repository.getter('ObligacionesExcepcionesRepository') protected obligacionesExcepcionesRepositoryGetter: Getter<ObligacionesExcepcionesRepository>,
  ) {
    super(Objeto, dataSource);
    this.subastas = this.createHasManyRepositoryFactoryFor('subastas', subastasRepositoryGetter);
    this.juicios = this.createHasManyRepositoryFactoryFor('juicios', juiciosRepositoryGetter);
    this.registerInclusionResolver('juicios', this.juicios.inclusionResolver);
    this.exenciones = this.createHasManyRepositoryFactoryFor('exenciones', exencionesRepositoryGetter);
    this.registerInclusionResolver('exenciones', this.exenciones.inclusionResolver);
    this.declaracionesJuradas = this.createHasManyRepositoryFactoryFor('declaraciones_juradas', declaracionesJuradasRepositoryGetter);
    this.registerInclusionResolver('declaraciones_juradas', this.declaracionesJuradas.inclusionResolver);
    this.obligaciones = this.createHasManyRepositoryFactoryFor('obligaciones', obligacionRepositoryGetter);
    this.registerInclusionResolver('obligaciones', this.obligaciones.inclusionResolver);
    this.domicilios = this.createHasManyRepositoryFactoryFor('domicilios', domicilioObjetoRepositoryGetter);
    this.registerInclusionResolver('domicilios', this.domicilios.inclusionResolver);
  }

  async setEtiqueta(etiqueta: string, filtro: Object) {
    //@ts-ignore
    var result: Row[] = await this.execute(`update read_side.buc_sujeto_objeto SET soj_etiquetas='${etiqueta}' where soj_suj_identificador='${filtro.sujeto_id}' and soj_tipo_objeto='${filtro.tipo_objeto}' and soj_identificador='${filtro.id}' IF EXISTS`, []);
    if (result[0].get(0) === true) {
      return {};
    }
    throw new EntityNotFoundError(Objeto, 'objeto');
  }

  async createObjeto(sujetoId: string) {
    const id = `PP${(new Date()).getTime()}`;
    const query = `INSERT INTO read_side.buc_sujeto_objeto (soj_suj_identificador,
      soj_tipo_objeto,soj_identificador,soj_descripcion,soj_fecha_inicio)
      values('${sujetoId}', 'P', '${id}', 'Plan de Pago', 
      '${moment().format('YYYY-MM-DD')}') IF NOT EXISTS`;
    //@ts-ignore
    let obj: Row[] = await this.execute(query, []);
    if (obj[0].get(0) !== true) {
      throw Object.assign(new Error, {
        message: 'Problemas para crear el objeto.',
        code: 'Gone',
        status: 410
      });
    }
    const objeto = await this.findOne({
      where: {
        and: [{id: id}, {sujeto_id:sujetoId}]
      }
    });
    if (!objeto) {
      throw new EntityNotFoundError(Objeto, 'id y/o sujeto_id');
    }
    return objeto;
  }
}
