import { useEffect, useMemo, useRef, useState } from "react";

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
import { debounce } from "../../../lib/helpers";
import ProductTableOptionsContainer from "./OptionsContainer/ProductTableOptionContainer";
import ProductTableHead from "./ProductTableHead";
import ProductTableBody from "./ProductTableBody";

const searchProducts = (products: ProductData[], term: string) => {
  const searched = products.filter((product) => {
    return Object.entries(product).filter((entry) => {
      return entry[1]
        .toString()
        .toLowerCase()
        .includes(term.toLocaleLowerCase());
    }).length > 0
      ? true
      : false;
  });
  return searched;
};

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
  const [term, setTerm] = useState<string>("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [filterPopup, setFilterPopup] = useState<boolean>(false);
  const containerRef: React.RefObject<HTMLDivElement> = useRef(null);
  const [canScroll, setCanScroll] = useState(false);

  let products = useMemo(() => {
    let searchedProducts = searchProducts(productsData, term);
    let filteredProducts = filterProducts(
      searchedProducts,
      filters,
      columnsData
    );
    let sortedProducts = sortProducts(filteredProducts, sortRules);
    return sortedProducts;
  }, [productsData, filters, term, columnsData, sortRules]);

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

  useEffect(() => {
    const checkScroll = () => {
      if (
        containerRef.current!.scrollHeight > containerRef.current!.clientHeight
      ) {
        setCanScroll(true);
      } else {
        setCanScroll(false);
      }
    };
    containerRef.current!.addEventListener("scroll", debounce(checkScroll, 60));

    return containerRef.current!.removeEventListener(
      "scroll",
      debounce(checkScroll, 60)
    );
  });

  if (products)
    return (
      <div className="my-20 flex flex-col items-center justify-center">
        <div className="border-b-2 border-slate-700 pb-6 text-center">
          <h1>Products</h1>
        </div>
        <div
          ref={containerRef}
          className="mt-12 h-[65vh] w-full overflow-auto rounded border-[1px] border-slate-200"
        >
          <ProductTableOptionsContainer
            columnsData={columnsData}
            term={term}
            setTerm={setTerm}
            filters={filters}
            setFilters={setFilters}
            sortRules={sortRules}
            setSortRules={setSortRules}
            filterPopup={filterPopup}
            setFilterPopup={setFilterPopup}
            sortPopup={sortPopup}
            setSortPopup={setSortPopup}
          />
          <table className="w-full table-fixed border-separate border-spacing-0 overflow-auto">
            <ProductTableHead columnsData={columnsData} />
            <ProductTableBody
              canScroll={canScroll}
              products={products}
              mainImages={mainImages}
            />
          </table>
        </div>
      </div>
    );
  else return <div>loading</div>;
}
