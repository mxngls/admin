import { GetServerSideProps } from "next";
import React, { useState } from "react";
import ImageUploadDialog from "../../../Components/admin/Product/ImageUploadDialog";
import { Toaster } from "react-hot-toast";
import ProductImagesContainer from "../../../Components/admin/Product/ProductImagesContainer";
import ProductTitle from "../../../Components/admin/Product/ProductTitle";
import {
  fetchColumns,
  fetchImageData,
  fetchProductData,
} from "../../../lib/queries";
import { ColumnsData, ImageData, ProductData } from "../../../lib/types";
import { convertNumberType } from "../../../lib/helpers";
import NumericAttribute from "../../../Components/admin/Product/NumericAttribute";
import TextAttribute from "../../../Components/admin/Product/TextAttribute";
import BooleanAttribute from "../../../Components/admin/Product/BooleanAttribute";

interface Product {
  columnsData: ColumnsData;
  productData: ProductData;
  imageData: ImageData[];
}

export default function Product({
  columnsData,
  productData,
  imageData,
}: Product) {
  const [product, setProduct] = useState<ProductData>(productData);
  const [images, setImages] = useState<ImageData[]>(imageData);
  const [openDialog, setOpenDialog] = useState<Boolean>(false);

  const handleOnClick = () => {
    if (!openDialog) {
      setOpenDialog(true);
    }
  };

  if (product) {
    return (
      <div className="my-16 text-lg sm:mx-auto sm:text-base md:max-w-[90%] lg:max-w-[75%] xl:max-w-[50%] 2xl:max-w-[40%]">
        <ProductTitle
          productId={product.product_id}
          name={product.name}
          type={"string"}
          setProduct={setProduct}
        />
        <ProductImagesContainer
          productId={product.product_id}
          images={images}
          setImages={setImages}
          handleOnClick={handleOnClick}
        />
        <div className="p-10">
          {Object.keys(product).map((key: string, index: number) => {
            if (key !== "product_id") {
              switch (columnsData[key].type) {
                case "string":
                  return (
                    <TextAttribute
                      key={index}
                      productId={product.product_id}
                      column={key}
                      value={product[key as keyof ProductData] as string}
                      type={convertNumberType(columnsData[key].type)}
                      setProduct={setProduct}
                    />
                  );
                case "integer":
                  return (
                    <NumericAttribute
                      key={index}
                      productId={product.product_id}
                      column={key}
                      value={product[key as keyof ProductData] as number}
                      type={convertNumberType(columnsData[key].type)}
                      setProduct={setProduct}
                    />
                  );
                case "boolean":
                  return (
                    <BooleanAttribute
                      key={index}
                      productId={product.product_id}
                      bool={product.sold}
                      column={key}
                      setProduct={setProduct}
                    />
                  );
              }
            }
          })}
        </div>
        <ImageUploadDialog
          images={images}
          setImages={setImages}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          productId={product.product_id}
        />
        <Toaster />
      </div>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const productsMeta = await fetchColumns("products");
  const columnsData = productsMeta.products.properties;

  const id = context.params!.id as string;
  const productData = await fetchProductData(id);
  const imageData = await fetchImageData(id);

  if (
    productData instanceof Error ||
    imageData instanceof Error ||
    productsMeta instanceof Error
  ) {
    return { notFound: true };
  } else {
    return {
      props: { productData, imageData, columnsData },
    };
  }
};
