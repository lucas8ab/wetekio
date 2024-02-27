import {DefaultCrudRepository, EntityNotFoundError, ANY} from '@loopback/repository';
import {Contactos, ContactosRelations} from '../models';
import {CassandraBucDataSource} from '../datasources';
import {inject} from '@loopback/core';
import moment = require('moment');

export class ContactosRepository extends DefaultCrudRepository<
  Contactos,
  typeof Contactos.prototype.id,
  ContactosRelations
> {
  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
    @inject('cuitRepresentado') private cuitRepresentado: string, 
  ) {
    super(Contactos, dataSource);
  }

  async createContacto(contacto: Contactos) {
    contacto.fechaInicio = moment().utc(true).local().toISOString();
    contacto.sujeto_id = this.cuitRepresentado;
    let contactoCreado = await this.create(contacto);

    return await this.findById(contactoCreado.id);
  }

  async updateContacto(id: string, data: Contactos) {
    await this.findById(id);
    await this.updateAll(data, {
      id: id,
      sujeto_id: this.cuitRepresentado
    });
    return this.findById(id);
  }
}
