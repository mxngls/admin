import { supabase } from "./client";
import { ProductData } from "./types";
import { ImageData } from "./types";

async function fetchProductData(id: string): Promise<ProductData | null> {
        if (error) throw new Error(error.message);
    try {
        const { data, error } = await supabase
            .from("products")
            .select()
            .eq("primary", id)
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
    id: number
): Promise<ProductData | null> {
    try {
        const { data, error } = await supabase
            .from("products")
            .update({ [column.toLocaleLowerCase()]: value })
            .match({ primary: id })
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
        if (error) throw error;
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

async function fetchImageData(
    id: string | number
): Promise<ImageData[] | null> {
    try {
        const { data, error } = await supabase
            .from("image_urls")
            .select("*")
            .eq("product_id", id)
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
    id: number,
    fileName: string,
    isMain = false
): Promise<ImageData> => {
    console.log(isMain);
    try {
        const { data, error } = await supabase
            .from("image_urls")
            .upsert(
                {
                    product_id: id,
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
    productId: number,
    isMain: Boolean
): Promise<ImageData[] | null> => {
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
    updateProductData,
    fetchProductData,
    fetchProductTypes,
    fetchImageData,
    fetchImage,
    insertImageData,
    deleteImageData,
    upDataImageData,
    unsetMainImage,
    deleteImage,
    uploadImage,
    toggleMainImage,
};
