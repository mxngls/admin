import { useEffect, useMemo, useState } from "react";

import {
    ProductData,
    ImageData,
    SortRule,
    MainImages,
    Filter,
    Products,
    ColumnsData,
} from "../../../lib/types";
import { fetchImage } from "../../../lib/queries";
import ProductTableOptionsContainer from "./OptionsContainer/ProductTableOptionContainer";
import ProductTableHead from "./ProductTableHead";
import ProductTableBody from "./ProductTableBody";

const sortProducts = (products: ProductData[], sortRules: SortRule[]) => {
    try {
        const sortCallback = (
            rules: SortRule[],
            index: number,
            a: ProductData,
            b: ProductData
        ): number => {
            if (index === rules.length) {
                return 0;
            }

            const key = rules[index].column as keyof ProductData;

            if (rules[index].ascending) {
                return a[key]! > b[key]!
                    ? 1
                    : a[key]! < b[key]!
                    ? -1
                    : sortCallback(rules, index + 1, a, b);
            } else {
                return a[key]! < b[key]!
                    ? 1
                    : a[key]! > b[key]!
                    ? -1
                    : sortCallback(rules, index + 1, a, b);
            }
        };
        let copy = products;
        copy.sort((a, b) => {
            if (sortRules.length === 0)
                return a.product_id.localeCompare(b.product_id, "en", {
                    numeric: true,
                });
            return sortCallback(sortRules, 0, a, b);
        });
        return copy;
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
};

const filterProducts = (
    products: ProductData[],
    filters: Filter[],
    columnsData: ColumnsData
) => {
    try {
        const filterCallback = (filters: Filter[], product: ProductData) => {
            for (let i = 0; i < filters.length; i++) {
                let value = product[filters[i].column as keyof ProductData];
                let compare = filters[i].compare;
                let type = columnsData[filters[i].column].type;

                if (!!compare) {
                    if (type === "string") {
                        value = (value as string).toLowerCase();
                        compare = (compare as string).toLowerCase();
                        const tags = ["en-US", "ko-KR"];
                        const res = value.localeCompare(compare, tags);

                        switch (filters[i].type) {
                            case "=":
                                return res === 0 && true;
                            case "<>":
                                return res !== 0 && true;
                            case ">":
                                return res > 0 && true;
                            case "<":
                                return res < 0 && true;
                            case ">=":
                                return res <= 0 && true;
                            case "<=":
                                return res >= 0 && true;
                            case "in":
                                return value.includes(compare) && true;
                            default:
                                return false;
                        }
                    } else if (type === "integer") {
                        switch (filters[i].type) {
                            case "=":
                                return value == compare && true;
                            case "<>":
                                return value != compare && true;
                            case ">":
                                return value! > compare && true;
                            case "<":
                                return value! < compare && true;
                            case ">=":
                                return value! >= compare && true;
                            case "<=":
                                return value! <= compare && true;
                            case "in":
                                return false;
                            default:
                                return false;
                        }
                    }
                }
            }
            return true;
        };
        return products.filter((product) => filterCallback(filters, product));
    } catch (error: any) {
        console.log("error", error.message);
        return error;
    }
};

export default function ProductTableContainer({
    productsData,
    mainImagesData,
    columnsData,
}: Products) {
    const [mainImages, setMainImages] = useState<MainImages>({});
    const [sortRules, setSortRules] = useState<SortRule[]>([]);
    const [sortPopup, setSortPopup] = useState<boolean>(false);
    const [filters, setFilters] = useState<Filter[]>([]);
    const [filterPopup, setFilterPopup] = useState<boolean>(false);

    let products = useMemo(() => {
        let filteredProducts = filterProducts(
            productsData,
            filters,
            columnsData
        );
        let sortedProducts = sortProducts(filteredProducts, sortRules);
        return filteredProducts;
    }, [productsData, filters, sortRules]);

    useEffect(() => {
        const getMainImages = async (mainImagesData: ImageData[]) => {
            mainImagesData.map(async (image) => {
                if (image) {
                    if (image.main === true) {
                        const url = await fetchImage(image.filepath)
                            .then((blob) => URL.createObjectURL(blob as Blob))
                            .catch((error) => {
                                console.log("error", error.message);
                                return error;
                            });
                        setMainImages((prevMainImages) => {
                            return {
                                ...prevMainImages,
                                [image.product_id]: url,
                            };
                        });
                    }
                }
            });
        };
        getMainImages(mainImagesData);
    }, [mainImagesData]);

    if (products)
        return (
            <div className="mt-20 flex flex-col items-center justify-center">
                <div className="border-b-2 border-slate-700 pb-6 text-center">
                    <h1>Products</h1>
                </div>
                <div className="mt-24 w-full border-separate rounded border-[1px] border-slate-200">
                    <ProductTableOptionsContainer
                        columnsData={columnsData}
                        filters={filters}
                        setFilters={setFilters}
                        sortRules={sortRules}
                        setSortRules={setSortRules}
                        filterPopup={filterPopup}
                        setFilterPopup={setFilterPopup}
                        sortPopup={sortPopup}
                        setSortPopup={setSortPopup}
                    />
                    <table className="w-full table-auto border-separate border-spacing-0">
                        <ProductTableHead columnsData={columnsData} />
                        <ProductTableBody
                            products={products}
                            mainImages={mainImages}
                        />
                    </table>
                </div>
            </div>
        );
    else return <div>loading</div>;
}
