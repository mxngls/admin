import ProductTable from "../../Components/admin/ProductTable/ProductTableContainer";
import { fetchMainImageData, fetchProductsData } from "../../lib/queries";
import { ProductData, ImageData } from "../../lib/types";

interface Products {
    productsData: ProductData[];
    mainImagesData: ImageData[];
    colArr: string[];
}

export default function Products({
    productsData,
    mainImagesData,
    colArr,
}: Products) {
    return (
            <ProductTable
                productData={productsData}
                mainImagesData={mainImagesData}
                colArr={colArr}
            />
    );
}

export async function getServerSideProps() {
    const columns = "id,name,designer,type,category,pieces,price";
    const colArr = columns.split(",");
    const productsData = await fetchProductsData(columns);
    const mainImagesData = await fetchMainImageData();

    if (productsData && mainImagesData) {
        return {
            props: { productsData, mainImagesData, colArr },
        };
    } else {
        return { notFound: true };
    }
}
