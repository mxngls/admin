import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import ProductAttribute from "../../../Components/admin/ProductAttribute";
import ImageUploadDialog from "../../../Components/admin/ImageUploadDialog";
import { Toaster } from "react-hot-toast";
import ProductImagesContainer from "../../../Components/admin/ProductImagesContainer";
import ProductTitle from "../../../Components/admin/ProductTitle";
import {
    fetchImageData,
    fetchProductData,
    fetchProductTypes,
} from "../../../lib/queries";
import { ImageData, ProductData } from "../../../lib/types";
import { capitalizeFirstLetter } from "../../../lib/helpers";
import { supabase } from "../../../lib/client";

interface Product {
    productData: ProductData;
    imageData: ImageData[];
    imageFiles: Blob[];
}

export default function Product({ productData, imageData }: Product) {
    const [product, setProduct] = useState<ProductData>(productData);
    const [images, setImages] = useState<ImageData[]>(imageData);
    const [openDialog, setOpenDialog] = useState<Boolean>(false);

    const handleOnClick = () => {
        if (!openDialog) {
            setOpenDialog(true);
        }
    };

    // TYPE
    // console.log(
    //     (async () => {
    //         const test = await fetchProductTypes();
    //         return test;
    //     })()
    // );

    if (product) {
        return (
            <div className="text-sm sm:text-base">
                <ProductTitle
                    id={product.id}
                    name={product.name}
                    type={"string"}
                    setProduct={setProduct}
                />
                <ProductImagesContainer
                    productId={product.id}
                    images={images}
                    setImages={setImages}
                    handleOnClick={handleOnClick}
                />
                {Object.keys(product).map((key: string, index: number) => {
                    if (key !== "id" && key !== "primary") {
                        return (
                            <ProductAttribute
                                key={index}
                                id={product.id}
                                column={key}
                                value={product[key as keyof ProductData]}
                                type={
                                    key === "pieces"
                                        ? "number"
                                        : key === "price"
                                        ? "number"
                                        : "string"
                                }
                                setProduct={setProduct}
                            />
                        );
                    }
                })}
                <ImageUploadDialog
                    images={images}
                    setImages={setImages}
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    id={product.id}
                />
                <Toaster />
            </div>
        );
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params!.id as string;
    const productData = await fetchProductData(id);
    const imageData = await fetchImageData(id);

    if (productData instanceof Error || imageData instanceof Error) {
        return { notFound: true };
    } else {
        return {
            props: { productData, imageData },
        };
    }
};
