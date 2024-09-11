import { GetServerSideProps } from "next";
import React, { useState } from "react";
import ImageUploadDialogasd from "../../../Components/admin/Product/ImageUploadDialog";
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
          {Object.keys(columnsData).map((col: string, index: number) => {
            if (col !== "product_id") {
              switch (columnsData[col].type) {
                case "string":
                  return (
                    <TextAttribute
                      key={index}
                      productId={product.product_id}
                      column={col}
                      value={product[col as keyof ProductData] as string}
                      type={convertNumberType(columnsData[col].type)}
                      setProduct={setProduct}
                    />
                  );
                case "integer":
                  return (
                    <NumericAttribute
                      key={index}
                      productId={product.product_id}
                      column={col}
                      value={product[col as keyof ProductData] as number}
                      type={convertNumberType(columnsData[col].type)}
                      setProduct={setProduct}
                    />
                  );
                case "boolean":
                  return (
                    <BooleanAttribute
                      key={index}
                      productId={product.product_id}
                      bool={product.sold}
                      column={col}
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

  console.log(columnsData);

  let productData: ProductData = {
    name: "",
    designer: "",
    type: "",
    category: "",
    description: "",
    pieces: 0,
    price: 0,
    product_id: "",
    sold: false,
  };

  console.log(productData);

  const imageData = null;
  return {
    props: { productData, imageData, columnsData },
  };
};
