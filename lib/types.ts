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

export interface ColumnsData {
    [key: string]: {
        format: string;
        type: string;
        default?: string;
        description?: string;
    };
}

export interface Products {
    productsData: ProductData[];
    mainImagesData: ImageData[];
    columnsData: ColumnsData;
}

export interface MainImages {
    [productId: string]: string;
}

export interface SortRule {
    column: string;
    ascending: boolean;
}

