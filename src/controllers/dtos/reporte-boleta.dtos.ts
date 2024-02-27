import { model, property } from "@loopback/repository";

@model()
export class DataDto {
    @property({
        type: 'string'
    })
    sujeto_id: string

    @property({
        type: 'string'
    })
    numero: string

    @property({
        type: 'string'
    })
    importe: string

    @property({
        type: 'string'
    })
    vencimiento: string

    @property({
        type: 'string'
    })
    fecha: string

    @property({
        type: 'string'
    })
    barcode_primero: string

    @property({
        type: 'string'
    })
    barcode_segundo: string

    @property({
        type: 'string'
    })
    qrcode: string
}

@model()
export class DataSetDto {
    @property({
        type: 'string'
    })
    concepto: string

    @property({
        type: 'string'
    })
    cuota: string

    @property({
        type: 'string'
    })
    id: string

    @property({
        type: 'string'
    })
    impuesto: string

    @property({
        type: 'string'
    })
    objeto_id: string

    @property({
        type: 'string'
    })
    objeto_tipo: string

    @property({
        type: 'string'
    })
    periodo: string

    @property({
        type: 'string'
    })
    prorroga: string

    @property({
        type: 'string'
    })
    saldo: string

    @property({
        type: 'string'
    })
    sujeto_id: string

    @property({
        type: 'string'
    })
    vencimiento: string
}


@model()
export class ReporteBoletaDto {
    @property({
        type: DataDto,
    })
    data: DataDto
    
    @property({
        type: 'array',
        itemType: DataSetDto
    })
    dataset: DataSetDto[]
}