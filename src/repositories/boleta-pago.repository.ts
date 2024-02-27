import {DefaultCrudRepository, EntityNotFoundError} from '@loopback/repository';
import {BoletaPago, BoletaPagoRelations} from '../models';
import {CassandraBucDataSource} from '../datasources';
import {inject} from '@loopback/core';
import { v4 as uuid } from 'uuid';

export class BoletaPagoRepository extends DefaultCrudRepository<
  BoletaPago,
  typeof BoletaPago.prototype.id,
  BoletaPagoRelations
> {
  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
  ) {
    super(BoletaPago, dataSource);
  }

  async createBoleta(boleta: BoletaPago): Promise<BoletaPago> {
    boleta.id = uuid();
    let query = `INSERT INTO read_side.buc_boleta_pago (bbp_id,bbp_numero,bbp_suj_identificador,
      bbp_estado_id,bbp_estado_descripcion,bbp_fecha,bbp_importe, bbp_medio_pago,
      bbp_obligaciones) values(${boleta.id},'${boleta.numero}','${boleta.sujeto_id}',
      '${boleta.estado_id}','${boleta.estado_descripcion}',
      '${boleta.fecha}','${boleta.importe}','${boleta.medio_pago}',
      ${JSON.stringify(boleta.obligaciones).replace(/"/g, '\'')}) IF NOT EXISTS`;
    await this.execute(query, []);
    var result = await this.findOne({where: {
      id: boleta.id,
      sujeto_id: boleta.sujeto_id
    }});
    if (!result) {
      throw Object.assign(new Error, {
        message: 'La boleta de pago no pudo ser creada',
        code: 'Gone',
        status: 410
      })
    }
    return result;
  }
}
