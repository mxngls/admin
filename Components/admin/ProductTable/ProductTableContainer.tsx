import { useEffect, useMemo, useState } from "react";

import { ProductData, ImageData } from "../../../lib/types";
import { fetchImage } from "../../../lib/queries";

import ProductTableOptionsContainer from "./OptionsContainer/ProductTableOptionContainer";
import ProductTableHead from "./ProductTableHead";
import ProductTableBody from "./ProductTableBody";

interface Products {
    productData: ProductData[];
    mainImagesData: ImageData[];
    colArr: string[];
}

interface MainImages {
    [productId: string]: string;
}

interface SortRule {
    column: string;
    ascending: boolean;
}

const sortProducts = (products: ProductData[], sortRules: SortRule[]) => {
    try {
        // const key = column as keyof ProductData;
        // Use type assertions as only columns retrieved form the database
        // are used as keys here. Therefore undefined objects can per definition
        // not be returned

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

        return products.sort((a, b) => {
            if (sortRules.length === 0) return a.id - b.id;
            return sortCallback(sortRules, 0, a, b);
        });
    } catch (error) {
        console.log(error);
    }
};

export default function ProductTable({
    productData,
    mainImagesData,
    colArr,
}: Products) {
    const [products] = useState<ProductData[]>(productData);
    const [mainImages, setMainImages] = useState<MainImages>({});
    const [sortRules, setSortRules] = useState<SortRule[]>([]);
    const [sortPopup, setSortPopup] = useState<boolean>(false);

    const sortedProducts = useMemo(
        () => sortProducts(products, sortRules),
        [products, sortRules]
    );

    useEffect(() => {
        console.log(sortedProducts);
    }, [sortedProducts]);

    useEffect(() => {
        const getMainImages = async (mainImagesData: ImageData[]) => {
            mainImagesData.map(async (image) => {
                if (image) {
                    if (image.main === true) {
                        const url = await fetchImage(image.filepath)
                            .then((blob) => URL.createObjectURL(blob!))
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

    useEffect(() => {
        console.log(sortRules);
    }, [sortRules]);

    if (products)
        return (
            <div className="flex flex-col items-center justify-center">
                <div className="border-b-2 border-slate-700 pb-6 text-center">
                    <h1>Products</h1>
                </div>
                <div className="mt-24 w-full border-separate rounded border-[1px] border-slate-200">
                    <ProductTableOptionsContainer
                        columns={colArr}
                        sortRules={sortRules}
                        setSortRules={setSortRules}
                        sortPopup={sortPopup}
                        setSortPopup={setSortPopup}
                    />
                    <table className="w-full table-auto border-separate over border-spacing-0">
                        <ProductTableHead columns={colArr} />
                        <ProductTableBody
                            products={sortedProducts!}
                            mainImages={mainImages}
                        />
                    </table>
                </div>
            </div>
        );
    else return <div>loading</div>;
}
