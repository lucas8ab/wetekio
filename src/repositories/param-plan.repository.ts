import {DefaultCrudRepository} from '@loopback/repository';
import {ParamPlan, ParamPlanRelations} from '../models';
import {CassandraBucDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ParamPlanRepository extends DefaultCrudRepository<
  ParamPlan,
  typeof ParamPlan.prototype.id,
  ParamPlanRelations
> {
  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
  ) {
    super(ParamPlan, dataSource);
  }
}
