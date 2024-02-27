import {
  /* inject, */
  bind,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
  inject,
} from '@loopback/context';

const moment = require('moment');
const _ = require('lodash');

import { RestElasticSearchService } from '../services/elasticsearch.service';
import { Tramite } from '../models';
/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@bind({ tags: { key: 'obtenerEstadoTramite' } })

export class ObtenerEstadoTramiteInterceptor implements Provider<Interceptor> {

  constructor(
    @inject('services.RestElasticSearch')
    private restElasticSearchService: RestElasticSearchService,
  ) { }

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      // Add pre-invocation logic here
      const result = await next();
      // Add post-invocation logic here
      //@ts-ignore
      var tramites = result.map(async (tramite) => {
        tramite = Object.assign({}, tramite);
        tramite.estado = await this.getEstadosTramite(tramite);
        return tramite;
      });

      return await Promise.all(tramites);
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }

  //@ts-ignore
  async getEstadosTramite(tramite: Tramite) {
    var result: any = await this.restElasticSearchService.getStateTramite(tramite.workflowInstanceKey);

    result = _(result[0]).orderBy((o: any) => {
      return moment(o._source.timestamp);
    }, ['desc']).uniqWith((e: any, o: any) => {
      return e._source.value.elementId == o._source.value.elementId;
    }).value();

    return result.map((tramite: any) => {
      return {
        proceso: tramite._source.value.elementId,
        fecha: moment(tramite._source.timestamp).format('DD/MM/YYYY HH:mm:ss'),
        instancia_id: tramite._source.value.elementInstanceKey
      };
    });
  }
}
