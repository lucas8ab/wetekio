import { getService, juggler } from '@loopback/service-proxy';
import { inject, Provider } from '@loopback/core';
import { RestElasticSearchDataSource } from '../datasources/rest-elastic-search.datasource';
export interface RestElasticSearchResponseData {
}
export interface RestElasticSearchService {
  getStateTramite(id?: string): Promise<RestElasticSearchResponseData>;
}
export class RestElasticSearchProvider implements Provider<RestElasticSearchService> {
  constructor(
    @inject('datasources.restElasticSearch')
    protected dataSource: juggler.DataSource = new RestElasticSearchDataSource(),
  ) { }
  value(): Promise<RestElasticSearchService> {
    return getService(this.dataSource);
  }
}
