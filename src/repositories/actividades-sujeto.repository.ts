import {DefaultCrudRepository} from '@loopback/repository';
import {ActividadesSujeto, ActividadesSujetoRelations} from '../models';
import {CassandraBucDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ActividadesSujetoRepository extends DefaultCrudRepository<
  ActividadesSujeto,
  typeof ActividadesSujeto.prototype.id,
  ActividadesSujetoRelations
> {
  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
  ) {
    super(ActividadesSujeto, dataSource);
  }
}
