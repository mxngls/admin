import { ProductData } from "../../../lib/types";
import ProductTableRow from "./ProductTableRow";

interface ProductTableBodyProps {
  canScroll: boolean;
  products: ProductData[];
  mainImages: MainImages;
}

interface MainImages {
  [productId: string]: string;
}

export default function ProductTableBody({
  canScroll,
  products,
  mainImages,
}: ProductTableBodyProps) {
  return (
    <tbody className="bg-slate-50/70">
      {products.map((product, index) => {
        let last = false;
        if (index === products.length - 1) last = true;
        return (
          <ProductTableRow
            canScroll={canScroll}
            key={index + "row"}
            productData={product}
            index={index}
            last={last}
            mainImage={mainImages[product.product_id]}
          />
        );
      })}
    </tbody>
  );
}
