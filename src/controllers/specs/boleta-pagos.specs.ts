import { model, Model, property } from "@loopback/repository";

@model({ settings: {strict: false}})
export class ItemDetalle extends Model {
    @property({
        type: 'string',
        required: true
    })
    id: string
}

@model({ settings: { strict: false } })
export class BoletaPagosSpec extends Model {
    @property({
        type: 'array',
        itemType: ItemDetalle,
        required: true
    })
    detalle: ItemDetalle[]
}