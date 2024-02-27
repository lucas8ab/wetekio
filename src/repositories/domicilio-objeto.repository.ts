import { DefaultCrudRepository } from '@loopback/repository';
import { DomicilioObjeto, DomicilioObjetoRelations } from '../models';
import { CassandraBucDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class DomicilioObjetoRepository extends DefaultCrudRepository<
  DomicilioObjeto,
  typeof DomicilioObjeto.prototype.id,
  DomicilioObjetoRelations
  > {
  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
  ) {
    super(DomicilioObjeto, dataSource);
  }
}
