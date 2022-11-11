/**
 * Types to display product and corresponding image data
 */
export interface ProductData {
    name: string;
    designer: string;
    type: string;
    category: string;
    description?: string;
    pieces: number;
    price: number;
    product_id: string;
}

export interface ImageData {
    filepath: string;
    main: Boolean;
    product_id: string;
    primary: number;
}

export interface InputError {
    isErr: Boolean;
    message: string;
}
