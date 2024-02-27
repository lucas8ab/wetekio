import {DefaultCrudRepository} from '@loopback/repository';
import {ParamRecargo, ParamRecargoRelations} from '../models';
import {CassandraBucDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ParamRecargoRepository extends DefaultCrudRepository<
  ParamRecargo,
  typeof ParamRecargo.prototype.indice,
  ParamRecargoRelations
> {
  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
  ) {
    super(ParamRecargo, dataSource);
  }
}
