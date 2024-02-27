/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { inject } from '@loopback/core';
/* eslint-disable no-undef */
import {
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
} from '@loopback/rest';
import {
  Obligacion, Sujeto,
} from '../models';
import {
  SujetoRepository,
  ObjetoRepository,
} from '../repositories';
import { SujetoObjetosDTO } from '../dtos/sujetoObjetos.dtos';
import { ObligacionesService } from './../services';
import * as _ from 'lodash';
import Descuento, { SaldosDescuento } from '../interfaces/descuento.interface';
import moment = require('moment');
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class SujetoObligacionController {
  constructor(
    @repository(SujetoRepository) protected sujetoRepository: SujetoRepository,
    @repository(ObjetoRepository) protected objetoRepository: ObjetoRepository,
    @inject('services.ObligacionesService') protected obligacionesService: ObligacionesService,
    @inject('cuitRepresentado') private cuitRepresentado: string
  ) { }

  @get('/sujetos/{id}/objetos/obligaciones', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de obligaciones de los objetos que pertenecen al Sujeto.',
        content: {
          'application/json': {
            schema: getModelSchemaRef(SujetoObjetosDTO, { includeRelations: true })
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.string('filtroTipos', getModelSchemaRef(Object)) filtroTipos: string,
    @param.query.string('filtroEstados', getModelSchemaRef(Object)) filtroEstados: string,
    @param.query.string('sort', {description: 'only values: ASC or DESC'}) sort: string,
  ) {
    const arrayTipos: any = filtroTipos ? filtroTipos.replace(/\s/g, "").split(',') : null;
    const arrayEstados: any = filtroEstados ? filtroEstados.replace(/\s/g, "").split(',') : null;
    const sortFixed: any = sort && ['ASC', 'DESC'].indexOf(sort.toUpperCase()) > -1 ? sort.toUpperCase() : '';

    var sujeto: Sujeto = await this.sujetoRepository.findById(this.cuitRepresentado, { 
      include: [{ relation: 'objetos', 
        scope: {
          include: [{ relation: 'obligaciones', 
            scope: {
              fields: {
                datos_adicionales: false,
              },
              include: [{ 
                relation: 'obligacionExceptuada',
                scope: {
                  fields: {
                    sujetoId: false,
                    objetoId: false,
                    tipoObjeto: false
                  }
                }
              }]
            }
          }]
        },
      }, {relation: 'objetosTerceros',
      scope: {
        where: {asociado: true},
        include: [{relation: 'obligacionTercero', 
          scope: {
            fields: {
              datos_adicionales: false,
            }
          }
        }]
      }
    }]
    });

    if(!sujeto.objetos)
      this.notFound(id);
    return await this.obligacionesService
                        .agregarCamposCalculados(
                          sujeto,
                          this.getSaldosObligacionesExceptedAndExpired(sujeto),
                          arrayTipos,
                          arrayEstados,
                          sortFixed
                        );
  }

  @get('sujetos/{id}/objetos/obligacion-a-vencer', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Obligacion proxima a vencer de los objetos que pertenecen al Sujeto.',
        content: {
          'application/json': {
            schema: getModelSchemaRef(SujetoObjetosDTO, { includeRelations: true })
          },
        },
      },
    },
  })
  async findObn(@param.path.string('id') id: string,
  ) {
    var sujeto: Sujeto = await this.sujetoRepository.findById(this.cuitRepresentado, { 
      include: [{ relation: 'objetos', 
        scope: {
          include: [{ relation: 'obligaciones', 
            scope: {
              fields: {
                datos_adicionales: false,
              },
              include: [{ 
                relation: 'obligacionExceptuada',
                scope: {
                  fields: {
                    sujetoId: false,
                    objetoId: false,
                    tipoObjeto: false
                  }
                }
              }]
            }
          }]
        },
      }, {relation: 'objetosTerceros',
      scope: {
        where: {asociado: true},
        include: [{relation: 'obligacionTercero', 
          scope: {
            fields: {
              datos_adicionales: false,
            }
          }
        }]
      }
    }]
    });

    if(!sujeto.objetos)
      this.notFound(this.cuitRepresentado);

    //Filtra la obligacion proxima a vencer del sujeto:
    sujeto.objetos.forEach(obj => {
      if(obj.obligaciones) {
        let noVencidas = obj.obligaciones.filter(obn => !obn.vencida);
        noVencidas = _.orderBy(noVencidas, ['prorroga'], ['asc']);
        if(noVencidas.length > 0)
          obj.obligaciones.splice(0, obj.obligaciones.length, noVencidas[0]);
        else
          obj.obligaciones = [];
      }
      else
        obj.obligaciones = [];
    });
    
    //Filtra la obligacion proxima a vencer de terceros:
    if(sujeto.objetosTerceros) {
      sujeto.objetosTerceros.forEach(obTr => {
        if(obTr.obligacionTercero) {
          let noVencidas = obTr.obligacionTercero.filter(obn => !obn.vencida);
          noVencidas = _.orderBy(noVencidas, ['prorroga'], ['asc']);
          if(noVencidas.length > 0)
            obTr.obligacionTercero.splice(0, obTr.obligacionTercero.length, noVencidas[0])
          else
            obTr.obligacionTercero = [];
        }
        else
          obTr.obligacionTercero = [];
      });
    }

    let sujetoFiltrado = await this.obligacionesService.agregarCamposCalculados(
      sujeto, 
      this.getSaldosObligacionesExceptedAndExpired(sujeto), 
      null, 
      null
      );

    return Object.assign({}, {
      objetos: sujetoFiltrado.objetos,
      objetosTerceros: sujetoFiltrado.objetosTerceros,
    });
  }

  @get('/sujetos/objetos/obligaciones/situacion', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Devuelve "true" si el Sujeto tiene deuda.',
        content: {
          'application/json': {
            schema: getModelSchemaRef(SujetoObjetosDTO, { includeRelations: true })
          },
        },
      },
    },
  })
  async getSituacion() {
    var sujeto: Sujeto = await this.sujetoRepository.findById(this.cuitRepresentado, { 
      include: [{ relation: 'objetos', 
        scope: {
          include: [{ relation: 'obligaciones', 
            scope: {
              where: {vencida: true},
              fields: {
                datos_adicionales: false,
              },
              include: [{ 
                relation: 'obligacionExceptuada',
                scope: {
                  fields: {
                    sujetoId: false,
                    objetoId: false,
                    tipoObjeto: false
                  }
                }
              }]
            }
          }]
        },
      }]
    });

    if(!sujeto.objetos)
      this.notFound(this.cuitRepresentado);
      
    let tieneDeuda = false;
    try {
      //Filtra las obligaciones vencidas:
      sujeto.objetos.forEach(obj => {
        if(obj.obligaciones) {
          let deuda = obj.obligaciones.filter(obn => 
            (obn.vencida && obn.cuota!='0' && obn.estado == null));
          if(deuda.length > 0) {
            tieneDeuda = true;
            throw this.cuitRepresentado + " tiene deuda.";
          }
        }
      });
    }
    catch (e) {
      console.log(e);
    }
    return tieneDeuda;
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
  
  notFound(id: string) {
    const err = new Error();
    Object.assign(err, {
      message: 'No existe un objeto asociado para el sujeto ' + id,
      code: 'Not Found',
      status: 404
    });
    throw err;
  }
}
