import {DefaultCrudRepository, repository} from '@loopback/repository';
import {PlanesPago, PlanesPagoRelations, Objeto} from '../models';
import {CassandraBucDataSource} from '../datasources';
import {inject} from '@loopback/core';
import { ObligacionRepository } from './obligacion.repository';
import { ObjetoRepository } from './objeto.repository';

export class PlanesPagoRepository extends DefaultCrudRepository<
  PlanesPago,
  typeof PlanesPago.prototype.id,
  PlanesPagoRelations
> {
  constructor(
    @inject('datasources.cassandra_buc')
    dataSource: CassandraBucDataSource,
    @repository(ObjetoRepository)
    protected objetoRepository: ObjetoRepository,
    @repository(ObligacionRepository)
    protected obligacionRepository: ObligacionRepository,
  ) {
    super(PlanesPago, dataSource);
  }

  async createPlanPago(planPago: any) {
    let promesas = await planPago.detalle.map(async (obn: any) => {
      obn = await this.obligacionRepository.findOne({
        where: {
          and: [
            {id: obn.id},
            {sujeto_id: obn.sujeto}
          ]
        }
      });
      return {
        id: obn.id,
        cuota: obn.cuota,
        periodo: obn.periodo,
        saldo: obn.saldo,
        concepto: obn.concepto,
        impuesto: obn.impuesto,
        objeto_id: obn.objeto_id,
        objeto_tipo: obn.objeto_tipo,
      };
    });
    planPago.detalle = await Promise.all(promesas);
    const plan = await this.create(planPago);
    await this.obligacionRepository.actualizarEstados(planPago.detalle, 'PP');
    const objeto = await this.objetoRepository.createObjeto(plan.sujeto_id);
    const obligaciones = await this.obligacionRepository.createObligacionesPlanPago(plan, objeto);
    return {plan, obligaciones};
  }
}
