import React, {
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
  useRef,
  useCallback,
} from "react";
import { capitalizeFirstLetter } from "../../../lib/helpers";
import { useClickOutside, useProductAttributeError } from "../../../lib/hooks";
import { ProductData } from "../../../lib/types";
import toast from "react-hot-toast";
import { updateProductData } from "../../../lib/queries";
import { callbackify } from "util";

interface AttributeProps {
  productId: string;
  column: string;
  value: number;
  type: string;
  setProduct: Dispatch<SetStateAction<ProductData>>;
}

export default function ProductAttribute({
  productId,
  column,
  value,
  type,
  setProduct,
}: AttributeProps) {
  const [title, setTitle] = useState<string>(column);
  const [content, setContent] = useState<number | string>(value);
  const [visibleContent, setVisibleContent] = useState<string>(
    value.toString()
  );
  const formRef = useRef<HTMLFormElement>(null);
  const initialRender = useRef(false);

  useEffect(() => {
    const checkIfNan = (
      value: string,
      callBack: Dispatch<SetStateAction<number | string>>
    ) => {
      isNaN(Number(value))
        ? callBack(visibleContent)
        : callBack(parseInt(value));
    };

    if (column === "price" && !initialRender.current) {
      initialRender.current = true;
      setVisibleContent(
        new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: "KRW",
        }).format(value)
      );
    } else if (column === "price" && !!initialRender) {
      const parsed = visibleContent.split(",").join("").slice(1);
      checkIfNan(parsed, setContent);
    } else {
      checkIfNan(visibleContent, setContent);
    }
    initialRender.current = true;
  }, [column, value, visibleContent]);

  let err = useProductAttributeError(content, type);

  const containerRef: React.RefObject<HTMLInputElement> = useClickOutside(
    () => {
      setContent(value);
    }
  );

  useEffect(() => setTitle(capitalizeFirstLetter(column)), [column]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (column === "price") {
      if (event.key === "Backspace" || event.key === "Delete") {
        if (visibleContent[1] === "0" && visibleContent.length === 2) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    }
  };

  const handleChangeContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (column === "price") {
      const parsed =
        value.length > 1 ? value.split(",").join("").slice(1) : "0";

      const reg = /^-?\d*\.?\d*$/;

      if (reg.test(parsed)) {
        setVisibleContent(
          new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
          }).format(parseInt(parsed))
        );
      } else setVisibleContent(value);
    } else {
      isNaN(Number(value))
        ? setVisibleContent(value)
        : setVisibleContent(Number(value).toString());
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!err.isErr) {
      toast.promise(
        updateProductData(column, content, productId).then(() =>
          setProduct((product) => ({ ...product, [column]: content }))
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
    }
  };
  return (
    <div className="mb-3 sm:mb-4 sm:flex sm:content-between sm:items-start xl:sm:justify-start">
      <h4 className="mb-3 sm:mb-0 sm:mr-[5%] sm:w-[25%]">{title}</h4>
      <form
        className="flex flex-col justify-between sm:w-[70%]"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="sm:[70%] flex flex-col justify-between">
          <input
            ref={containerRef}
            autoFocus={true}
            required={true}
            value={visibleContent}
            onKeyDown={(event) => handleKeyPress(event)}
            onChange={(event) => handleChangeContent(event)}
            className={`m-0 w-full resize-none overflow-y-hidden border-[1px] border-slate-200 p-[15px] text-slate-700 outline-none placeholder:text-slate-400 ${
              err.isErr
                ? "border-2 border-pink-500 p-[14px] text-pink-600 focus:border-pink-500"
                : "ring-slate-200 hover:ring-2 focus:border-[1px] focus:border-slate-700"
            } rounded focus:rounded focus:invalid:border-2`}
          />
          <div className="my-1 h-5">
            {err.isErr && <span className="text-pink-600">{err.message}</span>}
          </div>
        </div>
      </form>
    </div>
  );
}
