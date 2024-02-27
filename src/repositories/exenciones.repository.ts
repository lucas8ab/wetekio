import {DefaultCrudRepository} from '@loopback/repository';
import {Exenciones, ExencionesRelations} from '../models';
import {CassandraBucDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ExencionesRepository extends DefaultCrudRepository<
  Exenciones,
  typeof Exenciones.prototype.id,
  ExencionesRelations
> {
  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
  ) {
    super(Exenciones, dataSource);
  }
}
