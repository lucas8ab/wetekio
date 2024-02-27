import { DefaultCrudRepository, repository, BelongsToAccessor } from '@loopback/repository';
import { EtapasProc, EtapasProcRelations, Juicios } from '../models';
import { CassandraBucDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import {JuiciosRepository} from './juicios.repository';

export class EtapasProcRepository extends DefaultCrudRepository<
  EtapasProc,
  typeof EtapasProc.prototype.id,
  EtapasProcRelations
  > {

  public readonly juicios: BelongsToAccessor<Juicios, typeof EtapasProc.prototype.id>;

  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource, @repository.getter('JuiciosRepository') protected juiciosRepositoryGetter: Getter<JuiciosRepository>,
  ) {
    super(EtapasProc, dataSource);
    this.juicios = this.createBelongsToAccessorFor('juicio_id', juiciosRepositoryGetter,);
  }
}
