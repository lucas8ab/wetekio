/* eslint-disable @typescript-eslint/camelcase */
import {DefaultCrudRepository } from '@loopback/repository';
import {inject } from '@loopback/core';

import {
  ObligacionesExcepciones,
  ObligacionesExcepcionesWithRelations } from '../models';
import {CassandraBucDataSource} from '../datasources';

export class ObligacionesExcepcionesRepository extends DefaultCrudRepository<
  ObligacionesExcepciones,
  typeof ObligacionesExcepciones.prototype.obligacionId,
  ObligacionesExcepcionesWithRelations
> {

  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
  ) {
    super(ObligacionesExcepciones, dataSource);
  }
}
