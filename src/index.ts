import { SujetoBffApplication } from './application';
import { ApplicationConfig } from '@loopback/core';

export { SujetoBffApplication };

export async function main(options: ApplicationConfig = {}) {
  options.rest.basePath = '/webbff';
  const app = new SujetoBffApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);
  
  return app;
}
