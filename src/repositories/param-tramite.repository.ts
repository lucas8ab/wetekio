import {DefaultCrudRepository} from '@loopback/repository';
import {ParamTramite, ParamTramiteRelations} from '../models';
import {inject} from '@loopback/core';
import { CassandraBucDataSource } from '../datasources';

export class ParamTramiteRepository extends DefaultCrudRepository<
  ParamTramite,
  typeof ParamTramite.prototype.id,
  ParamTramiteRelations
> {

  constructor(
    @inject('datasources.cassandra_buc') 
    dataSource: CassandraBucDataSource, 
  ) {
    super(ParamTramite, dataSource);
  }
 
}
