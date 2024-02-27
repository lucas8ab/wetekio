import {DefaultCrudRepository} from '@loopback/repository';
import {Subastas, SubastasRelations} from '../models';
import {CassandraBucDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SubastasRepository extends DefaultCrudRepository<
  Subastas,
  typeof Subastas.prototype.id,
  SubastasRelations
> {
  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
  ) {
    super(Subastas, dataSource);
  }
}
