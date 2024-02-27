import { Entity, model, property, hasMany } from '@loopback/repository';
import { Objeto } from './objeto.model';
import { DomicilioSujeto } from './domicilio-sujeto.model';
import { Obligacion } from './obligacion.model';
import { ActividadesSujeto } from './actividades-sujeto.model';
import { Contactos } from './contactos.model';
import { DeclaracionesJuradas } from './declaraciones-juradas.model';
import { Exenciones } from './exenciones.model';
import { Juicios } from './juicios.model';
import { PlanesPago } from './planes-pago.model';
import { Tramite } from './tramite.model';
import { Subastas } from './subastas.model';
import {ObjetosTerceros} from './objetos-terceros.model';
import {BoletaPago} from './boleta-pago.model';

@model({ name: 'buc_sujeto', settings: { strict: false } })
export class Sujeto extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
    name: 'suj_identificador'
  })
  id: string;

  @property({
    type: 'string',
    name: 'suj_cat_suj_id'
  })
  categoria?: string;

  @property({
    type: 'string',
    name: 'suj_denominacion'
  })
  denominacion?: string;

  @property({
    type: 'string',
    name: 'suj_tipo'
  })
  tipo?: string;

  @property({
    type: 'string',
    name: 'suj_direccion'
  })
  direccion?: string;

  @property({
    type: 'string',
    name: 'suj_email'
  })
  email?: string;

  @property({
    type: 'string',
    name: 'suj_telefono'
  })
  telefono?: string;

  @property({
    type: 'number',
    name: 'suj_saldo'
  })
  saldo: number;

  @property({
    type: 'string',
    name: 'suj_dfe'
  })
  domicilio_fiscal?: string;

  @property({
    type: 'string',
    name: 'suj_riesgo_fiscal'
  })
  riesgo_fiscal?: string;

  @property({
    type: 'string',
    name: 'suj_situacion_fiscal'
  })
  situacion_fiscal?: string;

  @property({
    type: 'string',
    name: 'suj_id_externo'
  })
  id_externo?: string;

  @property({
    type: 'Object',
    name: 'suj_otros_atributos'
  })
  datos_adicionales?: string;

  @hasMany(() => Objeto, { keyTo: 'sujeto_id' })
  objetos: Objeto[];

  @hasMany(() => DomicilioSujeto, { keyTo: 'sujeto_id' })
  domicilios: DomicilioSujeto[];

  @hasMany(() => Obligacion, { keyTo: 'sujeto_id' })
  obligaciones: Obligacion[];

  @hasMany(() => ActividadesSujeto, { keyTo: 'sujeto_id' })
  actividades: ActividadesSujeto[];

  @hasMany(() => Contactos, { keyTo: 'sujeto_id' })
  contactos: Contactos[];

  @hasMany(() => DeclaracionesJuradas, { keyTo: 'sujeto_id' })
  declaraciones_juradas: DeclaracionesJuradas[];

  @hasMany(() => Exenciones, { keyTo: 'sujeto_id' })
  exenciones: Exenciones[];

  @hasMany(() => Juicios, { keyTo: 'sujeto_id' })
  juicios: Juicios[];

  @hasMany(() => PlanesPago, { keyTo: 'sujeto_id' })
  planes_pago: PlanesPago[];

  @hasMany(() => Tramite, { keyTo: 'sujeto_id' })
  tramites: Tramite[];

  @hasMany(() => Subastas, { keyTo: 'sujeto_id' })
  subastas: Subastas[];

  @hasMany(() => ObjetosTerceros, {keyTo: 'sujeto_id'})
  objetosTerceros: ObjetosTerceros[];
  
  @hasMany(() => BoletaPago, {keyTo: 'sujeto_id'})
  boleta_pagos: BoletaPago[];

  constructor(data?: Partial<Sujeto>) {
    super(data);
  }
}

export interface SujetoRelations {
  // describe navigational properties here
}

export type SujetoWithRelations = Sujeto & SujetoRelations;
