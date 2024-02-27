import {DefaultCrudRepository, EntityNotFoundError, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {ObjetosTerceros, ObjetosTercerosRelations, Obligacion} from '../models';
import {CassandraBucDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ObligacionRepository} from './obligacion.repository';

import moment = require('moment');

export class ObjetosTercerosRepository extends DefaultCrudRepository<
ObjetosTerceros,
  typeof ObjetosTerceros.prototype.objeto_id,
  ObjetosTercerosRelations
> {

  public readonly obligacionTercero:
   HasManyRepositoryFactory<Obligacion, typeof ObjetosTerceros.prototype.objeto_id>;

  constructor(
    @inject('datasources.cassandra_buc') dataSource: CassandraBucDataSource, 
    @repository.getter('ObligacionRepository') 
    protected obligacionRepositoryGetter: Getter<ObligacionRepository>,
  ) {
    super(ObjetosTerceros, dataSource);
    this.obligacionTercero = this.createHasManyRepositoryFactoryFor('obligacionTercero', obligacionRepositoryGetter);
    this.registerInclusionResolver('obligacionTercero', this.obligacionTercero.inclusionResolver);
  }

  async setEtiqueta(sujeto_id: string, tercero: ObjetosTerceros) {
    var queryUpdate = `UPDATE read_side.buc_relaciones_terceros SET
    brt_etiquetas= '${tercero.etiquetas}' 
    WHERE brt_suj_identificador='${sujeto_id}' AND brt_obj_identificador='${tercero.objeto_id}' 
    AND brt_tipo_objeto='${tercero.tipo_objeto}' IF EXISTS` ;
    //@ts-ignore
    var updateTercero: Row[] = await this.execute(queryUpdate, []);

      if (updateTercero[0].get(0) === true) {
      return await this.findOne({
        where: {
          sujeto_id: sujeto_id, 
          objeto_id: tercero.objeto_id, 
          tipo_objeto: tercero.tipo_objeto
        }
      });
    }
    throw new EntityNotFoundError(ObjetosTerceros, 'id, objeto_id y/o tipo_objeto');
  }

  async activaTercero(sujeto_id: string, tercero: ObjetosTerceros) {
    var queryUpdate = `UPDATE read_side.buc_relaciones_terceros SET brt_asociado=${true}, 
    brt_fecha_alta='${moment(tercero.fecha_alta).format('YYYY-MM-DD')}', brt_fecha_baja=null  
    WHERE brt_suj_identificador='${sujeto_id}' AND brt_obj_identificador='${tercero.objeto_id}' 
    AND brt_tipo_objeto='${tercero.tipo_objeto}' IF EXISTS` ;
    //@ts-ignore
    var updateTercero: Row[] = await this.execute(queryUpdate, []);

    if (updateTercero[0].get(0) === true) {
      return await this.findOne({
        where: {
          sujeto_id: sujeto_id, 
          objeto_id: tercero.objeto_id, 
          tipo_objeto: tercero.tipo_objeto
        }
      });
    }
    throw new EntityNotFoundError(ObjetosTerceros, 'id, objeto_id y/o tipo_objeto');
  }

  async deleteTercero(sujeto_id: string, objeto_id: string, tipo_objeto: string) {
    var queryDelete = `UPDATE read_side.buc_relaciones_terceros SET
    brt_fecha_baja='${moment().format('YYYY-MM-DD')}', brt_asociado= ${false}
    WHERE brt_suj_identificador='${sujeto_id}' AND brt_obj_identificador='${objeto_id}' 
    AND brt_tipo_objeto='${tipo_objeto}' IF EXISTS`;
    //@ts-ignore
    var borraTercero: Row[] = await this.execute(queryDelete, []);

    if (borraTercero[0].get(0) === true) {
      return {};
    }
    throw new EntityNotFoundError(ObjetosTerceros, 'id, objeto_id y/o tipo_objeto');
  }
}