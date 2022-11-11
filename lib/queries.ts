import { supabase } from "./client";
import { ProductData } from "./types";
import { ImageData } from "./types";

async function fetchProductsData(
    colums?: string
): Promise<ProductData[] | null> {
    try {
        const { data, error } = await supabase
            .from("products")
            .select(colums)
            .order("product_id");
        if (error) throw new Error(error.message);
        return data;
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
}

async function fetchProductData(
    product_id: string,
    columns?: string
): Promise<ProductData | Error> {
    try {
        const { data, error } = await supabase
            .from("products")
            .select(columns)
            .eq("product_id", product_id)
            .single();
        if (error) throw new Error(error.message);
        return data;
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
}

async function updateProductData(
    column: string,
    value: string | number,
    product_id: string
): Promise<ProductData | Error> {
    try {
        const { data, error } = await supabase
            .from("products")
            .update({ [column.toLocaleLowerCase()]: value })
            .eq("product_id", product_id)
            .single();
        if (error) throw new Error(error.message);
        return data;
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
}

async function fetchProductTypes() {
    try {
        const { data, error } = await supabase.rpc("get_product_types");
        if (error) throw new Error(error.message);
        return data;
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
}

async function fetchMainImageData(): Promise<ImageData[]> {
    try {
        const { data, error } = await supabase
            .from("image_urls")
            .select("*")
            .match({ main: true });
        if (error) throw new Error(error.message);
        return data;
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
}

async function fetchImageData(product_id: string): Promise<ImageData[] | Error> {
    try {
        const { data, error } = await supabase
            .from("image_urls")
            .select("*")
            .eq("product_id", product_id)
            .order("primary", { ascending: true });
        if (error) throw new Error(error.message);
        return data;
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
}

async function fetchImage(filepath: string): Promise<Blob | null> {
    try {
        const { data, error } = await supabase.storage
            .from("content")
            .download(filepath);
        if (error) throw new Error(error.message);
        return data;
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
}

const insertImageData = async (
    product_id: string,
    fileName: string,
    isMain = false
): Promise<ImageData> => {
    console.log(isMain);
    try {
        const { data, error } = await supabase
            .from("image_urls")
            .upsert(
                {
                    product_id: product_id,
                    filepath: `images/${fileName}`,
                    main: isMain,
                },
                { onConflict: "filepath" }
            )
            .select()
            .single();
        if (error) throw new Error(error.message);
        return data;
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
};

const deleteImageData = async (filepath: string): Promise<ImageData> => {
    try {
        const { data, error } = await supabase
            .from("image_urls")
            .delete()
            .eq("filepath", filepath)
            .single();
        if (error) throw new Error(error.message);
        return data;
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
};

const upDataImageData = async (
    column: string,
    value: string | number | Boolean,
    imageId: number
): Promise<void> => {
    try {
        const { error } = await supabase
            .from("image_urls")
            .update({ [column]: value })
            .eq("primary", imageId);
        if (error) throw new Error(error.message);
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
};

const unsetMainImage = async (imageId: number): Promise<void> => {
    try {
        const { error } = await supabase
            .from("image_urls")
            .update({ main: false })
            .neq("primary", imageId);
        if (error) throw error;
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
};

const toggleMainImage = async (
    imageId: number,
    productId: string,
    isMain: Boolean
): Promise<ImageData[] | Error> => {
    try {
        const { data, error } = await supabase.rpc("toggle_main_image", {
            image_id: imageId,
            product_id_foreign: productId,
            is_main: isMain,
        });
        if (error) {
            throw error;
        }
        return data;
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
};

const deleteImage = async (filepath: string): Promise<void> => {
    const { error } = await supabase.storage.from("content").remove([filepath]);
    if (error) throw error;
};

const uploadImage = async (file: File, filename: string) => {
    console.log(`images/${filename}`);
    try {
        const { error } = await supabase.storage
            .from("content")
            .upload(`images/${filename}`, file, { upsert: true });
        if (error) throw new Error(error.message);
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
};

export {
    fetchProductsData,
    fetchProductData,
    updateProductData,
    fetchProductTypes,
    fetchImage,
    deleteImage,
    uploadImage,
    fetchMainImageData,
    fetchImageData,
    insertImageData,
    deleteImageData,
    upDataImageData,
    unsetMainImage,
    toggleMainImage,
};
