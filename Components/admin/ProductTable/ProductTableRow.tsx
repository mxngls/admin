import { useRouter } from "next/router";
import { ProductData } from "../../../lib/types";
import ProductTableCell from "./ProductTableCell";
import ProductTableImage from "./ProductTableImage";

interface ProductRow {
  canScroll: boolean;
  productData: ProductData;
  index: number;
  last: boolean;
  mainImage: string | null;
}

export default function ProductTableRow({
  canScroll,
  productData,
  index,
  last,
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
      className={`${index % 2 !== 0 ? "bg-white" : "bg-slate-50"}`}
    >
      <ProductTableImage
        mainImage={mainImage}
        canScroll={canScroll}
        last={last}
        index={index}
      />
      {columns.map((attribute, cellIndex) => {
        return (
          <ProductTableCell
            type={
              typeof productData[attribute as keyof ProductData]! as
                | "string"
                | "number"
            }
            canScroll={canScroll}
            value={productData[attribute as keyof ProductData]!}
            key={index + "-row" + cellIndex + "-cell"}
            attribute={attribute}
            index={index}
            last={last}
          />
        );
      })}
    </tr>
  );
}
