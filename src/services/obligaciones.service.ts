/* eslint-disable @typescript-eslint/no-explicit-any */
import { bind, BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import {
  CuponesDescuentosRepository,
  ParamRecargoRepository,
  SujetosExcepcionesRepository
} from '../repositories';
import {
  Obligacion,
  Objeto,
  Sujeto,
  ParamRecargo,
  ObjetosTerceros,
} from '../models';
import Descuento, { SaldosDescuento } from '../interfaces/descuento.interface';

@bind({ scope: BindingScope.TRANSIENT })
export class ObligacionesService {
  constructor(
    @repository(ParamRecargoRepository)
      protected paramRecargoRepository: ParamRecargoRepository,
    @repository(CuponesDescuentosRepository)
      protected cuponesDescuentosRepository: CuponesDescuentosRepository,
    @repository(SujetosExcepcionesRepository)
      protected sujetosExcepcionesRepository: SujetosExcepcionesRepository
  ) {}

  /**
   * Metodo para añadir campos calculados a las obligaciones.
   * @param sujeto - Respuesta de sujeto-obligacion controller.
   * @param exceptedObligationsSaldo - Saldo de las obligaciones exceptuadas y vencidas.
   * @param arrayTipos -
   * @param arrayEstados -
   */
  async agregarCamposCalculados(
    sujeto: Sujeto,
    saldos: SaldosDescuento,
    arrayTipos: any,
    arrayEstados: any,
    sort= ''
  ): Promise<Sujeto> {

    const recargos: Array<ParamRecargo> = await this.paramRecargoRepository.find();
    const descuento: Descuento = await this.calcularSiCorrespondeDescuento(sujeto, saldos);

    sujeto.objetos = this.agregarCamposCalculadosObjetos(
      sujeto,
      recargos,
      arrayTipos,
      arrayEstados,
      descuento,
      sort
    );

    if (sujeto.objetosTerceros) {
      sujeto.objetosTerceros = this.agregarCamposCalculadosObjetosTerceros(
        sujeto,
        recargos,
        arrayTipos,
        arrayEstados,
        sort
      );
    }

    return sujeto;
  }

  /**
   * Metodo dedicado al manejo de campos en los objetos y obligaciones.
   * @param sujeto
   * @param recargos
   * @param arrayTipos
   * @param arrayEstados
   */
  private agregarCamposCalculadosObjetos(
    sujeto: Sujeto,
    recargos: Array<ParamRecargo>,
    arrayTipos: any,
    arrayEstados: any,
    descuento: Descuento,
    sort: string // 'ASC' 'DESC' ''
  ): Objeto[] {
    return sujeto.objetos.reduce((objetosVisibles: Objeto[], objeto: Objeto) => {
      if(this.esVisibleObjeto(arrayTipos, objeto)) {
        if(objeto.obligaciones) {
          const obligacionesArray = objeto.obligaciones.reduce((obligacionesVisibles: Obligacion[], obligacion: Obligacion) => {
            if(this.esVisibleObligacion(arrayEstados, obligacion)) {
              obligacion.aplicarInteresWithLogs(recargos);
              if(descuento.tieneDescuento) { obligacion.aplicarDescuento(descuento.cupones); }
              obligacionesVisibles.push(obligacion);
            }
            return obligacionesVisibles;
          }, []);
          objeto.obligaciones = sort === '' ? obligacionesArray : this.orderObligacion(obligacionesArray, sort)
        }
        objetosVisibles.push(objeto);
      }
      return objetosVisibles;
    }, []);
  }

  /**
   * Metodo dedicado al manejo de campos en los objetos de terceros.
   * @param sujeto
   */
  private agregarCamposCalculadosObjetosTerceros(
    sujeto: Sujeto,
    recargos: Array<ParamRecargo>,
    arrayTipos: any,
    arrayEstados: any,
    sort: string
  ): ObjetosTerceros[] {
    return sujeto.objetosTerceros.reduce((objetosTerceroVisibles: ObjetosTerceros[], objetoTercero: ObjetosTerceros) => {
      if(this.esVisibleObjeto(arrayTipos, objetoTercero)) {
        if (objetoTercero.obligacionTercero) {
          const obligacionesArray = objetoTercero.obligacionTercero.reduce((obligacionTerceroVisibles: Obligacion[], obligacionTercero: Obligacion) => {
            if(this.esVisibleObligacion(arrayEstados, obligacionTercero)) {
              obligacionTercero.aplicarInteresWithLogs(recargos)
              obligacionTerceroVisibles.push(obligacionTercero);
            }
            return obligacionTerceroVisibles;
          }, []);
          objetoTercero.obligacionTercero = sort === '' ? obligacionesArray : this.orderObligacion(obligacionesArray, sort)
        }
        objetosTerceroVisibles.push(objetoTercero);
      }
      return objetosTerceroVisibles;
    }, []);
  }

  /**
   * Metodo para saber si al sujeto le corresponde el descuento y obtener los cupones de descuento unicamente si la validacion se cumple.
   * @param sujeto
   * @param exceptedObligationsSaldo
   */
  private async calcularSiCorrespondeDescuento(sujeto: Sujeto, saldos: SaldosDescuento): Promise<Descuento> {
    const sujetoIsExcluded: boolean = await this.isExcludedSujeto(sujeto.id);
    if(sujetoIsExcluded || ((saldos.saldoVencidoNoExceptuadas - saldos.saldoExceptuadas) <= 0)) {
      return { tieneDescuento: true, cupones: await this.cuponesDescuentosRepository.getAllCuponesNotExpired() };
    }
    return { tieneDescuento: false, cupones: [] };
  }

  /**
   * Metodo para saber si el sujeto esta excluido a la logica de si le corresponde o no el descuento
   * @param sujetoId
   */
  private async isExcludedSujeto(sujetoId: string): Promise<boolean> {
    try {
      const sujetoExcluded = await this.sujetosExcepcionesRepository.findById(sujetoId);
      return sujetoExcluded
        ? sujetoExcluded.fechaBaja === null
            ? true
            : false
        : false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Metodo para saber si una obligacion se tiene que devolver o no en la respuesta.
   * @param arrayEstados
   * @param obligacion
   */
  private esVisibleObligacion(arrayEstados: any[], obligacion: Obligacion): boolean {
    return (!arrayEstados || (arrayEstados && !arrayEstados.includes(obligacion.estado)));
  }

  /**
   * Metodo para saber si un objeto se tiene que devolver o no en la respuesta.
   * @param arrayTipos
   * @param objeto
   * @param objetoTercero
   */
  private esVisibleObjeto(arrayTipos: any[], objeto: Objeto | ObjetosTerceros): boolean {
    return objeto instanceof Objeto
      ? (!arrayTipos || (arrayTipos && !arrayTipos.includes(objeto.tipo)))
      : (!arrayTipos || (arrayTipos && !arrayTipos.includes(objeto.tipo_objeto)));
  }

  /**
   *  Metodo para ordenar las obligaciones
   *  1. Tipo de objetos
   *  2. Objeto Id
   *  3. Periodo (Ascendente)
   *  4. Cuota (Descendete)
   */
  orderObligacion(obligaciones: Array<Obligacion>, sort: string): Array<Obligacion> {
    return obligaciones.sort((a: Obligacion, b: Obligacion) => {
      if (a.objeto_tipo < b.objeto_tipo) return -1
      if (a.objeto_tipo === b.objeto_tipo) {
        if (a.objeto_id < b.objeto_id) return -1;
        if (a.objeto_id === b.objeto_id) {
          if (sort === 'ASC') {
            if (a.periodo < b.periodo) return -1;
            if (a.periodo === b.periodo) {
              if (parseInt(a.cuota) < parseInt(b.cuota)) return -1;
              return 0;
            }
          }
          if (sort === 'DESC') {
            if (a.periodo > b.periodo) return -1;
            if (a.periodo === b.periodo) {
              if (parseInt(a.cuota) > parseInt(b.cuota)) return -1;
              return 0;
            }
          }
        }
      }
      return 1;
    })
  }

}
