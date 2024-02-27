import {DefaultCrudRepository} from '@loopback/repository';
import {inject} from '@loopback/core';

import {SujetosExcepciones, SujetosExcepcionesWithRelations} from '../models';
import {CassandraBucDataSource} from '../datasources';

export class SujetosExcepcionesRepository extends DefaultCrudRepository<
  SujetosExcepciones,
  typeof SujetosExcepciones.prototype.sujetoId,
  SujetosExcepcionesWithRelations
> {
  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
  ) {
    super(SujetosExcepciones, dataSource);
  }
}
