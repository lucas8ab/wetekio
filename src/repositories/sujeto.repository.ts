/* eslint-disable @typescript-eslint/camelcase */
import { DefaultCrudRepository, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { Sujeto, SujetoRelations, Objeto, DomicilioSujeto, Obligacion,
  ActividadesSujeto, Contactos, DeclaracionesJuradas, Exenciones, 
  Juicios, PlanesPago, Tramite, Subastas, BoletaPago, ObjetosTerceros} from '../models';
import { CassandraBucDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { ObjetoRepository } from './objeto.repository';
import { DomicilioSujetoRepository } from './domicilio-sujeto.repository';
import { ObligacionRepository } from './obligacion.repository';
import { ActividadesSujetoRepository } from './actividades-sujeto.repository';
import { ContactosRepository } from './contactos.repository';
import { DeclaracionesJuradasRepository } from './declaraciones-juradas.repository';
import { ExencionesRepository } from './exenciones.repository';
import { JuiciosRepository } from './juicios.repository';
import { PlanesPagoRepository } from './planes-pago.repository';
import {TramitesRepository} from './tramites.repository';
import {SubastasRepository} from './subastas.repository';
import {ObjetosTercerosRepository} from './objetos-terceros.repository';
import {BoletaPagoRepository} from './boleta-pago.repository';

export class SujetoRepository extends DefaultCrudRepository<
  Sujeto,
  typeof Sujeto.prototype.id,
  SujetoRelations
  > {

  public readonly objetos: HasManyRepositoryFactory<Objeto, typeof Sujeto.prototype.id>;

  public readonly domicilios: HasManyRepositoryFactory<DomicilioSujeto, typeof Sujeto.prototype.id>;

  public readonly obligaciones: HasManyRepositoryFactory<Obligacion, typeof Sujeto.prototype.id>;

  public readonly actividadesSujetos: HasManyRepositoryFactory<ActividadesSujeto, typeof Sujeto.prototype.id>;

  public readonly contactos: HasManyRepositoryFactory<Contactos, typeof Sujeto.prototype.id>;

  public readonly declaracionesJuradas: HasManyRepositoryFactory<DeclaracionesJuradas, typeof Sujeto.prototype.id>;

  public readonly exenciones: HasManyRepositoryFactory<Exenciones, typeof Sujeto.prototype.id>;

  public readonly juicios: HasManyRepositoryFactory<Juicios, typeof Sujeto.prototype.id>;

  public readonly planesPagos: HasManyRepositoryFactory<PlanesPago, typeof Sujeto.prototype.id>;

  public readonly tramites: HasManyRepositoryFactory<Tramite, typeof Sujeto.prototype.id>;

  public readonly subastas: HasManyRepositoryFactory<Subastas, typeof Sujeto.prototype.id>;

  public readonly boleta_pagos: HasManyRepositoryFactory<BoletaPago, typeof Sujeto.prototype.id>;

  public readonly objetosTerceros: HasManyRepositoryFactory<ObjetosTerceros, typeof Sujeto.prototype.id>;

  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource, @repository.getter('ObjetoRepository') protected objetoRepositoryGetter: Getter<ObjetoRepository>, @repository.getter('DomicilioSujetoRepository') protected domicilioSujetoRepositoryGetter: Getter<DomicilioSujetoRepository>, @repository.getter('ObligacionRepository') protected obligacionRepositoryGetter: Getter<ObligacionRepository>, @repository.getter('ActividadesSujetoRepository') protected actividadesSujetoRepositoryGetter: Getter<ActividadesSujetoRepository>, @repository.getter('ContactosRepository') protected contactosRepositoryGetter: Getter<ContactosRepository>, @repository.getter('DeclaracionesJuradasRepository') protected declaracionesJuradasRepositoryGetter: Getter<DeclaracionesJuradasRepository>, @repository.getter('ExencionesRepository') protected exencionesRepositoryGetter: Getter<ExencionesRepository>, @repository.getter('JuiciosRepository') protected juiciosRepositoryGetter: Getter<JuiciosRepository>, @repository.getter('PlanesPagoRepository') protected planesPagoRepositoryGetter: Getter<PlanesPagoRepository>, @repository.getter('TramitesRepository') protected tramitesRepositoryGetter: Getter<TramitesRepository>, @repository.getter('SubastasRepository') protected subastasRepositoryGetter: Getter<SubastasRepository>, @repository.getter('BoletaPagoRepository') protected boletaPagoRepositoryGetter: Getter<BoletaPagoRepository>, @repository.getter('ObjetosTercerosRepository') protected ObjetosTercerosRepositoryGetter: Getter<ObjetosTercerosRepository>,
  ) {
    super(Sujeto, dataSource);
    this.objetosTerceros = this.createHasManyRepositoryFactoryFor('objetosTerceros', ObjetosTercerosRepositoryGetter,);
    this.registerInclusionResolver('objetosTerceros', this.objetosTerceros.inclusionResolver);    
    this.boleta_pagos = this.createHasManyRepositoryFactoryFor('boleta_pagos', boletaPagoRepositoryGetter,);
    this.registerInclusionResolver('boleta_pagos', this.boleta_pagos.inclusionResolver);
    this.subastas = this.createHasManyRepositoryFactoryFor('subastas', subastasRepositoryGetter,);
    this.tramites = this.createHasManyRepositoryFactoryFor('tramites', tramitesRepositoryGetter,);
    this.planesPagos = this.createHasManyRepositoryFactoryFor('planes_pago', planesPagoRepositoryGetter);
    this.juicios = this.createHasManyRepositoryFactoryFor('juicios', juiciosRepositoryGetter);
    this.registerInclusionResolver('juicios', this.juicios.inclusionResolver);
    this.exenciones = this.createHasManyRepositoryFactoryFor('exenciones', exencionesRepositoryGetter);
    this.registerInclusionResolver('exenciones', this.exenciones.inclusionResolver);
    this.declaracionesJuradas = this.createHasManyRepositoryFactoryFor('declaraciones_juradas', declaracionesJuradasRepositoryGetter);
    this.registerInclusionResolver('declaraciones_juradas', this.declaracionesJuradas.inclusionResolver);
    this.contactos = this.createHasManyRepositoryFactoryFor('contactos', contactosRepositoryGetter);
    this.registerInclusionResolver('contactos', this.contactos.inclusionResolver);
    this.actividadesSujetos = this.createHasManyRepositoryFactoryFor('actividades', actividadesSujetoRepositoryGetter);
    this.registerInclusionResolver('actividades', this.actividadesSujetos.inclusionResolver);
    this.obligaciones = this.createHasManyRepositoryFactoryFor('obligaciones', obligacionRepositoryGetter);
    this.domicilios = this.createHasManyRepositoryFactoryFor('domicilios', domicilioSujetoRepositoryGetter);
    this.registerInclusionResolver('domicilios', this.domicilios.inclusionResolver);
    this.objetos = this.createHasManyRepositoryFactoryFor('objetos', objetoRepositoryGetter);
    this.registerInclusionResolver('objetos', this.objetos.inclusionResolver);
  }

}