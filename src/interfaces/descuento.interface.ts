import { CuponesDescuentos } from "../models";

export default interface Descuento {
    tieneDescuento: boolean; 
    cupones: CuponesDescuentos[]
}

export interface SaldosDescuento { 
    saldoExceptuadas: number;
    saldoVencidoNoExceptuadas: number; 
}