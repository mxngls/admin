import Image from "next/image";
import { RemoveSquare } from "iconoir-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    deleteImage,
    deleteImageData,
    fetchImageData,
    fetchImage,
    unsetMainImage,
    upDataImageData,
    toggleMainImage,
} from "../lib/queries";
import { ImageData } from "../lib/types";
import { SleeperChair } from "iconoir-react";
import { supabase } from "../lib/client";

interface ProductImageAttributes {
    imageId: number;
    productId: number;
    filepath: string;
    setImages: Dispatch<SetStateAction<ImageData[]>>;
    isMain: Boolean;
}

export default function ProductImage({
    imageId,
    productId,
    filepath,
    setImages,
    isMain,
}: ProductImageAttributes) {
    const [url, setURL] = useState<string | null>(null);

    useEffect(() => {
        fetchImage(filepath).then(
            (blob) => blob && setURL(URL.createObjectURL(blob))
        );
    }, [filepath]);

    const handleOnClickImage: React.MouseEventHandler<
        HTMLImageElement
    > = async () => {
        await toast.promise(
            toggleMainImage(imageId, productId, isMain)
                .then((imageData) => {
                    setImages(
                        imageData!
                            .sort((a, b) => a.primary - b.primary)
                    );
                })
                .catch((error) => {
                    console.log("error", error);
                    return error;
                }),
            {
                loading: "Loading...",
                success: "Set Main Image!",
                error: (error) => {
                    console.log("error", error);
                    return error;
                },
            }
        );
    };

    const handleOnClickButton: React.MouseEventHandler<
        HTMLButtonElement
    > = async () => {
        await toast.promise(
            deleteImage(filepath)
                .then(() => deleteImageData(filepath))
                .then((imageData) => {
                    setImages((prevImageData) =>
                        prevImageData!
                            .filter((img) => img.primary !== imageData.primary)
                            .sort()
                    );
                }),
            {
                loading: "Loading...",
                success: "Deleted Image!",
                error: (error) => {
                    console.log("error", error);
                    return error;
                },
            }
        );
    };

    if (url) {
        return (
            <div
                className={`${
                    !!isMain
                        ? "rounded-sm ring-[6px] ring-blue-500 ring-opacity-60"
                        : ""
                } 
                    relative transition-all duration-150 ease-in-out hover:z-10 hover:sm:scale-110 hover:sm:drop-shadow-2xl `}
            >
                <Image
                    onClick={(event: React.MouseEvent<HTMLImageElement>) =>
                        handleOnClickImage(event)
                    }
                    className={"rounded-sm object-cover shadow-slate-900"}
                    src={url}
                    alt="furniture"
                    layout="responsive"
                    height={100}
                    width={100}
                />
                <button
                    type="button"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                        handleOnClickButton(event)
                    }
                    className="absolute top-[5%] right-[5%] leading-none text-slate-50 opacity-25 hover:text-slate-50 hover:opacity-100"
                >
                    <RemoveSquare />
                </button>
            </div>
        );
    } else
        return (
            <div className="duration-400 relative flex animate-pulse items-center justify-center rounded border-2 border-slate-300 transition-all ease-in-out hover:z-10 hover:scale-110 hover:rounded-none hover:drop-shadow-2xl">
                <SleeperChair
                    color={"rgb(203 213 225 / 1"}
                    height={"50%"}
                    width={"50%"}
                    strokeWidth={"0.8"}
                />
            </div>
        );
}
