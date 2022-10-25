import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
    capitalizeFirstLetter,
    useClickOutside,
    useProductAttributeError,
} from "../lib/helpers";
import { updateProductData } from "../lib/queries";
import { ProductData } from "../lib/types";

interface ProductTitleAttributes {
    id: number;
    name: string;
    type: string | number;
    setProduct: Dispatch<SetStateAction<ProductData>>;
}

export default function ProductTitle({
    id,
    name,
    type,
    setProduct,
}: ProductTitleAttributes) {
    const [isEdit, setIsEdit] = useState<Boolean>(false);
    const [content, setContent] = useState<string | number>(name);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        setContent(name);
    }, [name]);

    let err = useProductAttributeError(content, type);

    const containerRef: React.RefObject<HTMLDivElement> = useClickOutside(
        () => {
            setIsEdit(false);
            setContent(name);
        }
    );

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
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
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
            toast.promise(updateProductData("name", content, id), {
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

    if (isEdit) {
        return (
            <div className="h-24" ref={containerRef}>
                <form className="" onSubmit={handleSubmit} ref={formRef}>
                    <input
                        type={"text"}
                        required={true}
                        value={content}
                        autoFocus={true}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => handleChangeContent(event)}
                        spellCheck={false}
                        className={`mb-2 box-border h-[78px] w-full pb-[18px] text-6xl font-semibold text-slate-700 outline-none focus:pb-4 
                        ${
                            err.isErr &&
                            "border-pink-500 text-pink-600 focus:border-b-2 focus:border-pink-500"
                        } 
                        invalid:border-pink-500 invalid:text-pink-600 focus:border-b-2 focus:border-slate-700 focus:invalid:border-b-2 focus:invalid:border-pink-500`}
                    ></input>
                    {err.isErr && (
                        <span className="text-pink-600">{err.message}</span>
                    )}
                </form>
            </div>
        );
    } else
        return (
            <div className="h-24" ref={containerRef}>
                <h1
                    className="mb-2 box-border h-[78px] w-full pb-[18px] text-6xl text-slate-400 transition-all duration-75 ease-in hover:border-b-2 hover:border-solid hover:border-slate-400"
                    onClick={handleOnClick}
                >
                    {!!name ? (
                        name
                    ) : (
                        <span className="text-slate-400 ">
                            {"insert a name"}
                        </span>
                    )}
                </h1>
            </div>
        );
}
