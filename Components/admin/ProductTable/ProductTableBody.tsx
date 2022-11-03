import { ProductData } from "../../../lib/types";
import ProductTableRow from "./ProductTableRow";

interface ProductTableBodyProps {
    products: ProductData[];
    mainImages: MainImages;
}

interface MainImages {
    [productId: string]: string;
}

export default function ProductTableBody({
    products,
    mainImages,
}: ProductTableBodyProps) {
    return (
        <tbody className="bg-slate-50/70">
            {products.map((product, index) => {
                return (
                    <ProductTableRow
                        key={index + "row"}
                        productData={product}
                        index={index}
                        mainImage={mainImages[product.id]}
                    />
                );
            })}
        </tbody>
    );
}
