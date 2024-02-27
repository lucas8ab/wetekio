import {bind, BindingScope} from '@loopback/core';
import { repository } from '@loopback/repository';
import { BoletaPagoRepository, SujetoRepository } from '../repositories';
import moment = require('moment');
import { BoletaPago } from '../models';
import * as _qrcode from 'qrcode';
import * as _barcode from 'jsbarcode';
let Canvas = require("canvas");

@bind({scope: BindingScope.TRANSIENT})
export class ReporteService {
  constructor(
    @repository(BoletaPagoRepository)
    public boletaPagoRepository : BoletaPagoRepository,
    @repository(SujetoRepository)
    public sujetoRepository : SujetoRepository,
  ) {}

  /*
    Funciones esenciales para la generacion de reporte 
  */
  async getReporte(id: string, format: string) {
    let boleta = await this.boletaPagoRepository.findById(id);
    boleta.obligaciones = boleta.obligaciones.map((obn: any) => {
      return {
        ...obn,
        vencimiento: moment(obn.vencimiento).format('YYYY-MM-DD'),
        prorroga: moment(obn.prorroga).format('YYYY-MM-DD')
      };
    });
    let barcode = await this.formatterBarcode(boleta);
    const qrcode = format == 'both' || format == 'qrcode' ? await this.getQRCode(barcode) : null;
    const barcode_primero: any = format == 'both' || format == 'barcode' ? 
      await this.getBarCode(barcode.substr(0,42)) : null;
    const barcode_segundo: any = format == 'both' || format == 'barcode' ?
      await this.getBarCode(barcode.substr(42,85)) : null;
    return await Object.assign({}, {
      data: {
        sujeto_id: boleta.sujeto_id,
        denominacion: await this.getDenominacionSujeto(boleta.sujeto_id),
        numero: boleta.numero,
        importe: boleta.importe,
        vencimiento: this.getVencimiento(boleta.obligaciones, 'DD/MM/YYYY'),
        fecha: moment(boleta.fecha).format('YYYY-MM-DD'),
        barcode_primero,
        barcode_segundo,
        qrcode,
      },
      dataset: boleta.obligaciones,
    });
  }

  async getDenominacionSujeto(sujeto_id: string) {
    let sujeto = await this.sujetoRepository.findById(sujeto_id);
    return sujeto.denominacion;
  }

  async formatterBarcode(boleta: BoletaPago): Promise<string> {
    let importe = boleta.importe.replace('.','');
    importe = importe.substr(0,importe.length-1) + '0';
    let barcode = `999${this.fillCerosLeft(16, boleta.numero.toString())}`;
    barcode += '0'.repeat(23);
    barcode += '0'.repeat(10);
    barcode += this.getVencimiento(boleta.obligaciones, 'DDMMYYYY');
    barcode += this.fillCerosLeft(12, boleta.sujeto_id.replace(/-/g,''));
    barcode += this.fillCerosLeft(10, importe);
    barcode += this.getDigito(barcode);
    barcode += this.getDigito(barcode);
    return barcode;
  }

  getDigito(barcode: string) {
    let serie = 2;
    let total = 0;
    
    barcode.split('').reverse().forEach(v => {
      total += parseInt(v) * serie;
      if (serie == 7) {
        serie = 2;
        return;
      }
      serie++;
    });

    let digito = (total % 11);
    if (10 == (11 - digito))
      return '0';
    if (11 == (11 - digito))
      return '1';
    return digito.toString();
  }

  fillCerosLeft(cantidad: number, valor: string) {
    let ceros = '0'.repeat(cantidad);
    return ceros.substring(0, ceros.length - valor.length) + valor;
  }

  getVencimiento(obligaciones: object[], format: string) {
    const obn: any = obligaciones.slice().sort(function (a: any, b: any) {
      return a.prorroga < b.prorroga ? -1 : 1;
    });
    const key = moment(obn[0].vencimiento).isAfter(obn[0].prorroga) ? 'vencimiento': 'prorroga';
    return moment(obn[0][key]).format(format);
  }

  generateAllCode(req: any) {
    const positionOne = req.path.indexOf('reporte') + 7;
    const code = req.path.substr(positionOne, req.path.length - positionOne);
    if (code.length == 0)
      return 'all';
    return code;
  }

  async getQRCode(code: string) {
    const qrcode = await _qrcode.toDataURL([{ data: code, mode: 'numeric'}]);
    return qrcode.split(',')[1];
  }

  async getBarCode(code: string) {
    const canva = new Canvas.Canvas();
    await _barcode(canva, code);
    return canva.toDataURL("image/png").split(',')[1];
  }
}
