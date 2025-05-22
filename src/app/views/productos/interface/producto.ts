export interface Producto {
    id: number;
    name: string;
    sku: string;
    barcode: string;
    stock_min: number;
    stock_max: number;
    unit: string  ;
    category__name: string;
    brand__name: string;
    active: boolean;
    description: string;
}
