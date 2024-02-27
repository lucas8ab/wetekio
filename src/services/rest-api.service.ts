import {
  bind,
  /* inject, */ BindingScope,
  Provider,
  inject,
} from '@loopback/core';
import {RestApiDataSource} from '../datasources';
import {getService} from '@loopback/service-proxy';

export interface RestApiResponseData {}

export interface RestApiService {
  call(endpoint: string, body: any, token?: string): Promise<RestApiDataSource>;
}

@bind({scope: BindingScope.TRANSIENT})
export class RestApiProvider implements Provider<RestApiService> {
  constructor(
    // restApi must match the name property in the datasource json file
    @inject('datasources.restApi')
    protected dataSource: RestApiDataSource = new RestApiDataSource(),
  ) {}

  value(): Promise<RestApiService> {
    return getService(this.dataSource);
  }
}
