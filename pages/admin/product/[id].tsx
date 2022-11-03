import { GetServerSideProps } from "next";
import React, { useState } from "react";
import ProductAttribute from "../../../Components/admin/Product/ProductAttribute";
import ImageUploadDialog from "../../../Components/admin/Product/ImageUploadDialog";
import { Toaster } from "react-hot-toast";
import ProductImagesContainer from "../../../Components/admin/Product/ProductImagesContainer";
import ProductTitle from "../../../Components/admin/Product/ProductTitle";
import { fetchImageData, fetchProductData } from "../../../lib/queries";
import { ImageData, ProductData } from "../../../lib/types";

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
            <div className="my-16 text-lg sm:mx-auto sm:text-base md:max-w-[90%] lg:max-w-[75%] xl:max-w-[62%] 2xl:max-w-[50%]">
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
                <div className="border-[1px] border-slate-200 bg-slate-50 p-10">
                    {Object.keys(product).map((key: string, index: number) => {
                        if (key !== "id" && key !== "primary") {
                            return (
                                <ProductAttribute
                                    key={index}
                                    id={product.id}
                                    column={key}
                                    value={product[key as keyof ProductData]!}
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
                </div>
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
