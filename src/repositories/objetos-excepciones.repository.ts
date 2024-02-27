import {DefaultCrudRepository} from '@loopback/repository';
import {inject} from '@loopback/core';

import {ObjetosExcepciones, ObjetosExcepcionesWithRelations} from '../models';
import {CassandraBucDataSource} from '../datasources';

export class ObjetosExcepcionesRepository extends DefaultCrudRepository<
  ObjetosExcepciones,
  typeof ObjetosExcepciones.prototype.objetoId,
  ObjetosExcepcionesWithRelations
> {
  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
  ) {
    super(ObjetosExcepciones, dataSource);
  }
}
