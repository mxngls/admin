import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { capitalizeFirstLetter } from "../../../lib/helpers";
import { ProductData } from "../../../lib/types";
import toast from "react-hot-toast";
import { updateProductData } from "../../../lib/queries";

interface AttributeProps {
  productId: string;
  bool: boolean;
  column: string;
  setProduct: Dispatch<SetStateAction<ProductData>>;
}

export default function ProductAttribute({
  productId,
  bool,
  column,
  setProduct,
}: AttributeProps) {
  const [title, setTitle] = useState<string>(column);
  const [isTrue, setIsTrue] = useState<boolean>(bool);

  useEffect(() => setTitle(capitalizeFirstLetter(column)), [column]);

  const toggleAttribute = async (bool: boolean) => {
    toast.promise(
      updateProductData(column, bool, productId).then(() =>
        setProduct((product) => ({ ...product, [column]: bool }))
      ),
      {
        loading: "Loading...",
        success: `Updated "${capitalizeFirstLetter(column)}"`,
        error: (error) => {
          console.log("error", error);
          return error;
        },
      }
    );
  };

  return (
    <div className="mb-10 flex items-center sm:mb-3 sm:content-between sm:items-start sm:justify-start">
      <h4 className="mr-5 text-slate-700 sm:mb-0 sm:mr-[5%] sm:w-[25%]">
        {title}
      </h4>
      <label
        htmlFor={`toggleSort-${column}`}
        className="flex cursor-default items-center"
      >
        <div
          className={`relative flex w-full items-center justify-center rounded-full p-1 duration-75 ease-in-out ${
            isTrue ? "hover:bg-green-200" : "hover:bg-slate-200"
          }`}
        >
          <input
            onChange={() => {
              setIsTrue((current) => !current);
              toggleAttribute(isTrue);
            }}
            type="checkbox"
            name="toggleSort"
            value="toggleSort"
            id={`toggleSort-${column}`}
            className="sr-only"
            checked={isTrue}
          />
          <div
            className={`block h-6 w-10 rounded-full ${
              isTrue ? "bg-green-500" : "bg-slate-600"
            }`}
          ></div>
          <div
            className={`${
              isTrue ? "translate-x-4 bg-white" : "bg-slate-400"
            } absolute left-2 h-4 w-4 rounded-full transition`}
          ></div>
        </div>
      </label>
    </div>
  );
}
