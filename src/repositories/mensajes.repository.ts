import {DefaultCrudRepository} from '@loopback/repository';
import {Mensajes, MensajesRelations} from '../models';
import {CassandraBucDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class MensajesRepository extends DefaultCrudRepository<
  Mensajes,
  typeof Mensajes.prototype.clave,
  MensajesRelations
> {
  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
  ) {
    super(Mensajes, dataSource);
  }
}
