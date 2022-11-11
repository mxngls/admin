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

    return (
        <tr
            onClick={() => handleOnClick()}
            className={`${index % 2 !== 0 ? "bg-white" : "bg-slate-50"}`}
        >
            <ProductTableImage mainImage={mainImage} index={index} />
            {Object.keys(productData).map((attribute: string, cellIndex) => {
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
                        index={index}
                    />
                );
            })}
        </tr>
    );
}
