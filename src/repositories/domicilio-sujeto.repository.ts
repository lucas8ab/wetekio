import { DefaultCrudRepository } from '@loopback/repository';
import { DomicilioSujeto, DomicilioSujetoRelations } from '../models';
import { CassandraBucDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class DomicilioSujetoRepository extends DefaultCrudRepository<
  DomicilioSujeto,
  typeof DomicilioSujeto.prototype.id,
  DomicilioSujetoRelations
  > {
  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
  ) {
    super(DomicilioSujeto, dataSource);
  }
}
