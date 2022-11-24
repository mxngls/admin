import { useRouter } from "next/router";
import { useEffect } from "react";
import { ProductData } from "../../../lib/types";
import ProductTableCell from "./ProductTableCell";
import ProductTableImage from "./ProductTableImage";

interface ProductRow {
    productData: ProductData;
    index: number;
    mainImage: string | null;
}

export default function ProductTableRow({
    productData,
    index,
    mainImage,
}: ProductRow) {
    const router = useRouter();
    const handleOnClick = () => {
        router.push(`/admin/product/${productData.product_id}`);
    };
    const columns = Object.keys(productData);

    return (
        <tr
            onClick={() => handleOnClick()}
            className={`${
                index % 2 !== 0
                    ? "bg-white"
                    : "last: border-b-[1px] bg-slate-50"
            }`}
        >
            <ProductTableImage
                mainImage={mainImage}
                length={columns.length}
                index={index}
            />
            {columns.map((attribute, cellIndex) => {
                return (
                    <ProductTableCell
                        type={
                            typeof productData[
                                attribute as keyof ProductData
                            ]! as "string" | "number"
                        }
                        value={productData[attribute as keyof ProductData]!}
                        key={index + "-row" + cellIndex + "-cell"}
                        attribute={attribute}
                        length={columns.length}
                        index={index}
                    />
                );
            })}
        </tr>
    );
}
