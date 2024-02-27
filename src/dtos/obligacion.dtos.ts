import { Entity, model, property } from '@loopback/repository';
@model()
export class Obligacion extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
  })
  id: string;

  @property({
    type: 'number',
  })
  capital?: number;

  @property({
    type: 'string',
  })
  cuota?: string;

  @property({
    type: 'string',
  })
  estado?: string;

  @property({
    type: 'string',
  })
  fiscalizada?: string;

  @property({
    type: 'string',
  })
  indice_interes_punitorio?: string;

  @property({
    type: 'string',
  })
  indice_interes_resarcitorio?: string;

  @property({
    type: 'number',
  })
  interes_punitorio?: number;

  @property({
    type: 'number',
  })
  interes_resarcitorio?: number;

  @property({
    type: 'number',
  })
  juicio_id?: number;

  @property({
    type: 'string',
  })
  periodo?: string; 

  @property({
    type: 'date',
  })
  prorroga?: string;

  @property({
    type: 'string',
  })
  tipo?: string;

  @property({
    type: 'number',
  })
  total?: number;

  @property({
    type: 'number',
  })
  saldo: number;

  @property({
    type: 'date',
  })
  vencimiento?: string;

  @property({
    type: 'string',
  })
  concepto?: string;

  @property({
    type: 'string',
  })
  impuesto?: string;

  @property({
    type: 'boolean',
  })
  exenta?: boolean;

  @property({
    type: 'number',
  })
  porcentaje_exencion?: number;

  @property({
    type: 'Object',
  })
  datos_adicionales?: string;

  @property({
    type: 'boolean'
  })
  vencida?: boolean;

  @property({
    type: 'number',
  })
  descuento?: number;

  @property({
    type: 'number',
  })
  saldoConRecargo: number;

}
