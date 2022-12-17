import React, {
    useState,
    useEffect,
    SetStateAction,
    Dispatch,
    useRef,
    useLayoutEffect,
} from "react";
import { capitalizeFirstLetter } from "../../../lib/helpers";
import { useClickOutside, useProductAttributeError } from "../../../lib/hooks";
import { ProductData } from "../../../lib/types";
import toast from "react-hot-toast";
import { updateProductData } from "../../../lib/queries";

interface AttributeProps {
    productId: string;
    column: string;
    value: string;
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
    const [content, setContent] = useState<string>(value);
    const formRef = useRef<HTMLFormElement>(null);

    let err = useProductAttributeError(content, type);

    const containerRef: React.RefObject<HTMLTextAreaElement> = useClickOutside(
        () => {
            setContent(value);
        }
    );

    const resizeTextarea = () => {
        containerRef.current!.style.height = "auto";
        containerRef.current!.style.height =
            containerRef.current!.scrollHeight + "px";
    };

    useLayoutEffect(() => {
        resizeTextarea();
    });

    useEffect(() => setTitle(capitalizeFirstLetter(column)), [column]);

    const handleChangeContent = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setContent(event.target.value);
        resizeTextarea();
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

    const submitOnEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            // Prevent newline
            event.preventDefault();
            const submit = new Event("submit", {
                bubbles: true,
                cancelable: true,
            });
            formRef.current?.dispatchEvent(submit);
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
                <textarea
                    ref={containerRef}
                    onChange={handleChangeContent}
                    rows={1}
                    onKeyDown={submitOnEnter}
                    name="editProductAttribute"
                    required={true}
                    value={content}
                    autoFocus={true}
                    spellCheck={false}
                    className={`m-0 w-full resize-none overflow-y-hidden border-[1px] border-slate-200 p-[15px] text-slate-700 outline-none placeholder:text-slate-400 ${err.isErr
                            ? "border-2 border-pink-500 text-pink-600 focus:border-pink-500"
                            : "ring-slate-200 hover:ring-2 focus:border-[1px] focus:border-slate-700"
                        } rounded focus:rounded focus:invalid:border-2`}
                ></textarea>
                <div className="my-1 h-5">
                    {err.isErr && <span className="text-pink-600">{err.message}</span>}
                </div>
            </form>
        </div>
    );
}
