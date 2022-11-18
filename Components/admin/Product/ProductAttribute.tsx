import React, {
    useState,
    useEffect,
    SetStateAction,
    Dispatch,
    useRef,
} from "react";
import { capitalizeFirstLetter } from "../../../lib/helpers";
import { useClickOutside, useProductAttributeError } from "../../../lib/hooks";
import { ProductData } from "../../../lib/types";
import toast from "react-hot-toast";
import { updateProductData } from "../../../lib/queries";
import { number } from "prop-types";

interface AttributeProps {
    productId: string;
    column: string;
    value: string | number;
    type: string;
    setProduct: Dispatch<SetStateAction<ProductData>>;
}

const formatValue = (value: string | number) => {
    const formatted = new Intl.NumberFormat("ko-KR").format(value as number);
    return formatted;
};

export default function ProductAttribute({
    productId,
    column,
    value,
    type,
    setProduct,
}: AttributeProps) {
    const [title, setTitle] = useState<string>(column);
    const [isEdit, setIsEdit] = useState<Boolean>(false);
    const [content, setContent] = useState<string | number>(value);
    const [contentHeight, setContentHeight] = useState<{
        height: number;
        width: number;
    } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    let err = useProductAttributeError(
        content,
        // Convert types returned from Postgres query to JS Objects
        // to enable comparision in useProductAttributeError hook
        type === "string" ? "string" : "number"
    );

    const containerRef: React.RefObject<HTMLDivElement> &
        React.RefObject<HTMLInputElement> &
        React.RefObject<HTMLTextAreaElement> = useClickOutside(() => {
        setIsEdit(false);
        setContent(value);
    });

    useEffect(() => {
        setContent(value);
        setContentHeight({
            height: containerRef.current?.offsetHeight!,
            width: containerRef.current?.offsetWidth!,
        });
    }, [containerRef, value]);

    useEffect(() => setTitle(capitalizeFirstLetter(column)), [column]);

    const handleOnClick = () => {
        const selection = window.getSelection();
        if (selection?.type !== "Range")
            if (!!isEdit) {
                setIsEdit(false);
            } else {
                setIsEdit(true);
            }
    };

    const handleChangeContent = (
        event:
            | React.ChangeEvent<HTMLTextAreaElement>
            | React.ChangeEvent<HTMLInputElement>
    ) => {
        if (type === "integer") {
            const number = Number(event.target.value)
                ? parseInt(event.target.value)
                : event.target.value;
            setContent(number);
        } else {
            setContent(event.target.value);
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

    if (isEdit) {
        return (
            <div className="mb-6 sm:flex sm:content-between sm:items-start xl:sm:justify-start">
                <h4 className="sm:mr-[5%] sm:w-[25%]">{title}</h4>
                <form
                    className="flex flex-col justify-between sm:w-[70%]"
                    onSubmit={handleSubmit}
                    ref={formRef}
                >
                    <div
                        style={{
                            maxWidth: contentHeight?.width,
                            height: contentHeight?.height,
                        }}
                    >
                        {type === "string" ? (
                            <textarea
                                ref={containerRef}
                                onKeyDown={submitOnEnter}
                                name="editProductPttribute"
                                required={true}
                                value={content}
                                autoFocus={true}
                                onChange={(
                                    event: React.ChangeEvent<HTMLTextAreaElement>
                                ) => handleChangeContent(event)}
                                spellCheck={false}
                                className={`h-full w-full resize-none p-[15px] text-slate-700 outline-none placeholder:text-slate-400 ${
                                    err.isErr
                                        ? "border-2 border-pink-500 text-pink-600 focus:border-pink-500"
                                        : "focus:border-[1px] focus:border-slate-700"
                                } focus:rounded focus:p-[11px] focus:invalid:border-2`}
                            ></textarea>
                        ) : (
                            <input
                                ref={containerRef}
                                autoFocus={true}
                                required={true}
                                value={content}
                                min={0}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => handleChangeContent(event)}
                                className={`h-full w-full resize-none p-[15px] text-slate-700 outline-none placeholder:text-slate-400 ${
                                    err.isErr
                                        ? "border-2 border-pink-500 text-pink-600 focus:border-pink-500"
                                        : "focus:border-[1px] focus:border-slate-700"
                                } focus:rounded focus:p-[11px] focus:invalid:border-2`}
                            />
                        )}
                    </div>
                    <div className="mt-2 h-6">
                        {err.isErr && (
                            <span className="text-pink-600">{err.message}</span>
                        )}
                    </div>
                </form>
            </div>
        );
    } else
        return (
            <div className="mb-6 sm:flex sm:content-between sm:items-start sm:justify-start">
                <h4 className="text-slate-400 sm:mr-[5%] sm:w-[25%]">
                    {title}
                </h4>
                <div
                    ref={containerRef}
                    className="mb-8 whitespace-pre-line rounded border-[1px] border-slate-200 bg-white p-[11px] text-slate-400 transition-all duration-75 ease-in-out hover:cursor-default focus:border-slate-700 focus:ring-1 focus:ring-slate-700 sm:w-[70%]"
                    onClick={handleOnClick}
                >
                    {!!value ? (
                        type === "number" ? (
                            formatValue(value)
                        ) : (
                            value
                        )
                    ) : (
                        <span>{`insert ${column}`}</span>
                    )}
                </div>
            </div>
        );
}
