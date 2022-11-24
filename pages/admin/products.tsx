import ProductTable from "../../Components/admin/ProductTable/ProductTableContainer";
import {
    fetchColumns,
    fetchMainImageData,
    fetchProductsData,
} from "../../lib/queries";
import { Products } from "../../lib/types";

export default function ProductsPage({
    productsData,
    mainImagesData,
    columnsData,
}: Products) {
    return (
        // <div className="overflow-y-scroll">
            <ProductTable
                productsData={productsData}
                mainImagesData={mainImagesData}
                columnsData={columnsData}
            />
        // </div>
        
    );
}

export async function getServerSideProps() {
    const productsMeta = await fetchColumns("products");
    const columnsData = productsMeta.products.properties;

    const colString = Object.keys(columnsData).join(",");

    const productsData = await fetchProductsData(colString);
    const mainImagesData = await fetchMainImageData();

    if (productsData && mainImagesData) {
        return {
            props: { productsData, mainImagesData, columnsData },
        };
    } else {
        return { notFound: true };
    }
}
