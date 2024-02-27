import {RequestContext, HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import {bind, BindingScope} from '@loopback/core';
const jwt = require('jsonwebtoken');
const verifyAsync = promisify(jwt.verify);
const fs = require('fs');

@bind({scope: BindingScope.TRANSIENT})
export class JWTService {
  constructor() {}

  async verifyToken(context: RequestContext) {
    const {request} = context;

    if (
      request.url.indexOf('/explorer') > -1 ||
      request.originalUrl.endsWith('webbff/') ||
      request.originalUrl.endsWith('publico')
    )
      return;

    try {
      if (!request.headers.authorization) throw new Error(`'token' is null`);

      const PUB_KEY = fs.readFileSync(__dirname + '/../public.pub', 'utf8');
      if (!request.headers.authorization.startsWith('Bearer'))
        throw new Error('malformed token');
      const token = request.headers.authorization.split(' ')[1];
      const decodedToken = await verifyAsync(token, PUB_KEY, {
        algorithms: ['RS256'],
      });
      context.bind('token').to(token);
      context.bind('cuitRepresentado').to(decodedToken.cuitRepresentado);
      context.bind('cuit').to(decodedToken.cuit);
      //@ts-ignore
      context.bind('id').to(decodedToken[request.query.id]);
      context.bind('grupo').to(decodedToken.grupo);
      context.bind('isBackOffice').to(decodedToken.isBackOffice);
      //fix TDR token:
      context.bind('usuarioTipoId').to(decodedToken.usuarioTipoId);
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
  }
}
