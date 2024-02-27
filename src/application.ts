import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, BindingKey } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import * as path from 'path';
import { MySequence } from './sequence';
import { CassandraBucDataSource, RestElasticSearchDataSource } from './datasources';
import { HealthComponent, HealthBindings } from '@loopback/extension-health';

import { LogConfig } from './environment';

import * as moment from 'moment';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { SECURITY_SCHEME_SPEC } from './utils/security-spec';

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');

const pkg: PackageInfo = require('../package.json');


//define custom format for logs
const customFormat = winston.format.combine(
  winston.format.splat(),
  winston.format.simple(),
  winston.format.align(),
  winston.format.printf(
    info =>
      `{"startTime":"${moment().toISOString()}","level":"${info.level}","data":${info.message}}`,
  ),
);

//logger for the acct-statdates
winston.loggers.add(LogConfig.logName, {
  exitOnError: false,
  format: winston.format.combine(customFormat),
  transports: [
    new DailyRotateFile({
      filename: LogConfig.logDirectory + LogConfig.logFileWarning,
      datePattern: LogConfig.logDatePattern,
      zippedArchive: true,
      level: 'info',
    }),
    new DailyRotateFile({
      filename: LogConfig.logDirectory + LogConfig.logFileIssue,
      datePattern: LogConfig.logDatePattern,
      zippedArchive: true,
      level: 'warn',
    }),
    new winston.transports.Console({
      level: 'info',
    }),
  ],
});


export class SujetoBffApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.api({
      openapi: '3.0.0',
      info: { title: pkg.name, version: pkg.version },
      paths: {},
      components: { securitySchemes: SECURITY_SCHEME_SPEC },
      servers: [{ url: '/' }],
    });

    /* Incorporacion de health Check con 3 path:
    http://localhost:3000/health
    http://localhost:3000/live
    http://localhost:3000/ready
    */
    this.component(HealthComponent);


    // Enviroment of database Cassandra
    const db_host = process.env.CASSANDRA_HOST || 'localhost';
    const db_port = process.env.CASSANDRA_PORT || 9042;
    const db_user = process.env.CASSANDRA_USER || '';
    const db_pass = process.env.CASSANDRA_PASSWORD || '';
    const database = process.env.CASSANDRA_DB || 'read_side';

    this.bind('datasources.config.cassandra_buc').to({
      name: 'cassandra_buc',
      connector: 'cassandra',
      host: db_host,
      port: db_port,
      user: db_user,
      password: db_pass,
      database: database,
      useNewUrlParser: true,
    });
    this.bind('datasources.db').toClass(CassandraBucDataSource);



    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
