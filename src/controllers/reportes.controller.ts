import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
} from '@loopback/rest';
import {
  Obligacion,
  Exenciones,
} from '../models';
import {
  SujetoRepository,
  ObjetoRepository,
  ObligacionRepository,
} from '../repositories';
import * as _ from 'lodash';
import { SujetoObjetosDTO } from '../dtos/sujetoObjetos.dtos';
import moment = require('moment');
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { inject } from '@loopback/core';

export class ReportesController {
  constructor(
    @repository(ObligacionRepository) protected obligacionRepository: ObligacionRepository,
    @repository(SujetoRepository) protected sujetoRepository: SujetoRepository,
    @repository(ObjetoRepository) protected objetoRepository: ObjetoRepository,
    @inject('cuitRepresentado') private cuitRepresentado: string
  ) { }

  @get('reportes/deuda', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Reporte de las obligaciones de los objetos que pertenecen al Sujeto.',
        content: {
          'application/json': {
            schema: getModelSchemaRef(SujetoObjetosDTO, { includeRelations: true })
          },
        },
      },
    },
  })
  async find(
    @param.query.string('sujeto_id') sujeto_id: string,
    @param.query.string('objeto_id') objeto_id: string,
    @param.query.string('objeto_tipo') objeto_tipo: string,
  ) {
    let obligaciones = await this.obligacionRepository
      .findByManyId(objeto_id, objeto_tipo);
    let dataset = await _.chain(obligaciones).map((item) => {
      return {
        identificacion: item.id,
        cuenta: item.objeto_id,
        concepto: `Cuota ${item.periodo}/${item.cuota}`,
        monto: Math.fround(item.saldo).toFixed(2),
        vencimiento: moment(item.prorroga).format('DD/MM/YYYY')
      };
    }).value();

    let sujeto = await this.sujetoRepository.findById(this.cuitRepresentado);
    let objeto = await this.objetoRepository.findOne({
      where: {
        sujeto_id: sujeto.id,
        id: objeto_id,
        tipo: objeto_tipo,
      }
    });
    let data = {
      nombreCompleto: sujeto.denominacion,
      cuit: sujeto.id,
      objetoId: objeto_id,
      direccion: objeto ? objeto.descripcion : '',
      total: _.sumBy(dataset, item => Number(item.monto)).toFixed(2),
    };
    return { data, dataset };
  }
}
