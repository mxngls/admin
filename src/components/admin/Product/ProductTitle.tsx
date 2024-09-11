import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { capitalizeFirstLetter } from "../../../lib/helpers";
import { useClickOutside, useProductAttributeError } from "../../../lib/hooks";
import { updateProductData } from "../../../lib/queries";
import { ProductData } from "../../../lib/types";

interface ProductTitleAttributes {
  productId: string;
  name: string;
  type: string | number;
  setProduct: Dispatch<SetStateAction<ProductData>>;
}

export default function ProductTitle({
  productId,
  name,
  type,
  setProduct,
}: ProductTitleAttributes) {
  const [content, setContent] = useState<string | number>(name);

  useEffect(() => {
    setContent(name);
  }, [name]);

  let err = useProductAttributeError(content, type);

  const containerRef: React.RefObject<HTMLDivElement> = useClickOutside(() => {
    setContent(name);
  });

  const handleChangeContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value)) {
      setContent(Number(event.target.value));
    } else {
      setContent(event.target.value);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!err.isErr) {
      toast.promise(updateProductData("name", content, productId), {
        loading: "Loading...",
        success: `Updated "${capitalizeFirstLetter("name")}"`,
        error: (error) => {
          console.log("error", error);
          return error;
        },
      }).then;
      setProduct((product) => ({ ...product, name: content as string }));
    }
  };

  return (
    <div ref={containerRef}>
      <form onSubmit={handleSubmit}>
        <input
          type={"text"}
          required={true}
          value={content}
          autoFocus={true}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeContent(event)
          }
          spellCheck={false}
          className={`mb-8 box-border h-[78px] w-full border-b-2 border-solid border-slate-200 text-6xl font-semibold text-slate-700 outline-none invalid:border-pink-500 invalid:text-pink-600 focus:pb-4 focus:invalid:border-pink-500
                        ${
                          err.isErr &&
                          "mb-0 border-pink-500 text-pink-600 focus:border-b-2 focus:border-pink-500"
                        } `}
        />
        {err.isErr && (
          <div className="my-3 h-5 text-pink-600">{err.message}</div>
        )}
      </form>
    </div>
  );
}
