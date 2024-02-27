import {
  /* inject, */
  globalInterceptor,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/context';
import { RestBindings } from '@loopback/rest';

import { LogConfig } from '../environment/environment';
import * as winston from 'winston';
var uniqid = require('uniqid');

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', { tags: { name: 'logging' } })
export class LoggingInterceptor implements Provider<Interceptor> {
  public logger = winston.loggers.get(LogConfig.logName);
  /*
  constructor() {}
  */

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
    let txid = uniqid();
    try {
      // Add pre-invocation logic here
      const req = await invocationCtx.get(RestBindings.Http.REQUEST);
      //@ts-ignore
      var cuit = getCuit(req.path);
      this.logger.info(
        JSON.stringify({
          //@ts-ignore
          GLOBAL: req.ip,
          TXID: txid,
          TXIDP: 'COPERNICO',
          FECHA: new Date().toISOString(),
          ENV: process.env.NODE_ENV,
          APP: 'WEB-BFF',
          NIVEL: 'INFO',
          CLASE: invocationCtx.targetClass.name,
          METODO: invocationCtx.methodName,
          //@ts-ignore
          headers: req.headers,
          //@ts-ignore
          method: req.method,
          //@ts-ignore
          params: req.params,
          //@ts-ignore
          path: req.path,
          //@ts-ignore
          protocol: req.protocol,
          //@ts-ignore
          query: req.query,
          //@ts-ignore
          url: req.url,
          type: 'request',
          cuit: cuit,
        }),
      );

      const result = await next();
      // Add post-invocation logic here
      const res = await invocationCtx.get(RestBindings.Http.RESPONSE);

      this.logger.info(
        JSON.stringify({
          //@ts-ignore
          GLOBAL: req.ip,
          TXID: txid,
          TXIDP: 'COPERNICO',
          FECHA: new Date().toISOString(),
          ENV: process.env.NODE_ENV,
          APP: 'WEB-BFF',
          NIVEL: 'INFO',
          CLASE: invocationCtx.targetClass.name,
          METODO: invocationCtx.methodName,
          //@ts-ignore
          headers: req.headers,
          //@ts-ignore
          method: req.method,
          //@ts-ignore
          params: req.params,
          //@ts-ignore
          path: req.path,
          //@ts-ignore
          protocol: req.protocol,
          //@ts-ignore
          query: req.query,
          //@ts-ignore
          url: req.url,
          type: 'response',
          //@ts-ignore
          statusCode: res.statusCode,
          cuit: cuit,
        }),
      );

      return result;
    } catch (err) {
      this.logger.error(
        JSON.stringify({
          GLOBAL: 1,
          TXID: txid,
          TXIDP: 'COPERNICO',
          FECHA: new Date().toISOString(),
          ENV: process.env.NODE_ENV,
          APP: 'WEB-BFF',
          NIVEL: 'ERROR',
          CLASE: invocationCtx.targetClass.name,
          METODO: invocationCtx.methodName,
          type: 'response',
          error_stack: err.stack,
          statusCode: 500,
        }),
      );
      throw err;
    }
  }
}


//@ts-ignore
function getCuit(path) {
  const positionOne = path.indexOf('sujetos/') + 8;
  const positionTwo = path.indexOf('/', positionOne);
  const range = positionTwo - positionOne;
  return path.substr(
    positionOne,
    range,
  );
}

/*
GLOBAL: Id de transaccion global.
TXID: Id de transaccion de la aplicacion
TXIDP: Id de transaccion de la aplicacion "padre".
FECHA: fecha en que se realizo el logueo.
ENV: Ambiente en el cual se esta ejecutando la aplicacion(TEST,PREPROD,PROD)
APP: Nombre de la aplicacion.
NIVEL:[INFO: para informacion general- DEBUG:Trace de la app- CRITICAL: Errores criticos. se enviara emaol o msj por slack- ERROR: mensaje de error que se obtiene de la captura de una excepcion]
CLASE: Es la clase en cual se genero el log.
METODO/LINEA:El metodo y la linea en el cual se loguea.
*/
