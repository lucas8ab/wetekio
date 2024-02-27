import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import { juggler } from '@loopback/repository';
//@ts-ignore
import * as config from './cassandra-buc.config';

@lifeCycleObserver('datasource')
export class CassandraBucDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'cassandra_buc';

  constructor(
    @inject('datasources.config.cassandra_buc', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
