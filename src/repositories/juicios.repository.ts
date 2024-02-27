import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Juicios, JuiciosRelations, EtapasProc} from '../models';
import {CassandraBucDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {EtapasProcRepository} from './etapas-proc.repository';

export class JuiciosRepository extends DefaultCrudRepository<
  Juicios,
  typeof Juicios.prototype.id,
  JuiciosRelations
> {

  public readonly etapasJuicio: HasManyRepositoryFactory<EtapasProc, typeof Juicios.prototype.id>;

  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource, @repository.getter('EtapasProcRepository') protected etapasProcRepositoryGetter: Getter<EtapasProcRepository>,
  ) {
    super(Juicios, dataSource);
    this.etapasJuicio = this.createHasManyRepositoryFactoryFor('etapasJuicio', etapasProcRepositoryGetter,);
  }
}
