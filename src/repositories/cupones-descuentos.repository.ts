import { DefaultCrudRepository, Filter } from '@loopback/repository';
import { inject } from '@loopback/core';

import { CuponesDescuentos, CuponesDescuentosRelations } from '../models';
import { CassandraBucDataSource } from '../datasources';

import moment = require('moment');
import CuponDetail from '../interfaces/cupones-detalles.interface';

export class CuponesDescuentosRepository extends DefaultCrudRepository<
  CuponesDescuentos,
  typeof CuponesDescuentos.prototype.obligacionId,
  CuponesDescuentosRelations
  > {
  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource,
  ) {
    super(CuponesDescuentos, dataSource);
  }

  /**
   * Method to get all coupons not expired.
   * @param filter
   */
  public async getAllCuponesNotExpired(
    filter?: Filter<CuponesDescuentos>,
  ): Promise<CuponesDescuentos[]> {
    return (await this.find(filter))
      .map((cupon: CuponesDescuentos) => {
        if (cupon.detalles && cupon.detalles.length) {
          cupon.detalles = cupon.detalles.filter((detail: CuponDetail) => !detail.bdc_fecha_baja && moment(new Date(detail.bdc_vencimiento)) >= moment(new Date()))
        }
        return cupon;
      })
      .filter(
        (cupon: CuponesDescuentos) =>
          cupon.detalles && cupon.detalles.length,
      );
  }
}