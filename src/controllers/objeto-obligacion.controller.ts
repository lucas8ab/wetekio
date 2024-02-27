import {
  repository, Filter,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
} from '@loopback/rest';
import {
  Obligacion, Objeto, Sujeto,
} from '../models';
import { ObjetoRepository, SujetoRepository } from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { ObligacionesService } from './../services';
import { inject } from '@loopback/core';
import { SaldosDescuento } from '../interfaces/descuento.interface';
import * as _ from 'lodash';

export class ObjetoObligacionController {
  constructor(
    @repository(ObjetoRepository) protected objetoRepository: ObjetoRepository,
    @repository(SujetoRepository) protected sujetoRepository: SujetoRepository,
    @inject('services.ObligacionesService') protected obligacionesService: ObligacionesService,
  ) { }

  @get('/objetos/{id}/obligaciones', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de obligaciones del Objeto',
        content: { 'application/json': { schema: getModelSchemaRef(Obligacion) } },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Obligacion>,
  ): Promise<Obligacion[]> {
    return this.objetoRepository.obligaciones(id).find(filter);
  }

  @get('/objetos/{id}/obligaciones/publico', {
    responses: {
      '200': {
        description: 'Objeto con sus obligaciones.',
        content: { 'application/json': { schema: getModelSchemaRef(Objeto) } },
      },
    },
  })
  async findObject(
    @param.path.string('id') id: string,
  ): Promise<Objeto> {
    const objeto = await this.objetoRepository.findById(id);
    const obligaciones = await this.objetoRepository.obligaciones(id).find();
    objeto.obligaciones = obligaciones;
    let sujeto = await this.sujetoRepository.findById(objeto.sujeto_id);
    sujeto.objetos = [objeto];

    return (await this.obligacionesService
                        .agregarCamposCalculados(
                          sujeto, 
                          this.getSaldosObligacionesExceptedAndExpired(sujeto), 
                          null, 
                          null
                        )).objetos[0];
  }

  getSaldosObligacionesExceptedAndExpired(sujeto: Sujeto): SaldosDescuento {
    let saldoExceptuadas = 0;
    let saldoVencidoNoExceptuadas = 0;
    const obligaciones: Obligacion[] = _.mapValues(sujeto.objetos, 'obligaciones')['0'];
    obligaciones.forEach((obl: Obligacion) => {
      if(obl.vencida) {
        saldoVencidoNoExceptuadas += obl.saldo;
        if(obl.isExcepted()) {
          saldoExceptuadas += obl.obligacionExceptuada.saldo || obl.saldo;
        }
      }
    });
    return {saldoExceptuadas, saldoVencidoNoExceptuadas};
  }
}
