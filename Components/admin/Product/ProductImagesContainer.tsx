import ProductImage from "./ProductImage";
import Button from "../../shared/Button";
import { Dispatch, SetStateAction } from "react";

import { ImageData } from "../../../lib/types";

interface ProductImagesContainerAttributes {
    productId: number;
    handleOnClick: React.MouseEventHandler<HTMLButtonElement>;
    images: ImageData[] | null;
    setImages: Dispatch<SetStateAction<ImageData[]>>;
}

export default function ProductImagesContainer({
    productId,
    handleOnClick,
    images,
    setImages,
}: ProductImagesContainerAttributes) {
    return (
        <div className="my-7 pb-7 border-b-2 border-slate-200 grid grid-flow-row auto-rows-fr grid-cols-2 place-items-stretch justify-items-stretch gap-5 text-sm transition-all duration-500 ease-linear xs:grid-cols-3 sm:text-base">
            {!!images &&
                images.map((image, index) => (
                    <ProductImage
                        imageId={image.primary}
                        productId={productId}
                        setImages={setImages}
                        key={index}
                        filepath={image.filepath}
                        isMain={image.main}
                    />
                ))}
            <div className="flex min-w-[21%] items-center justify-center place-self-stretch rounded border-2 border-dashed border-slate-400 transition-opacity duration-500 ease-linear before:pt-[100%]">
                <Button type={"button"} onClickHandler={handleOnClick}>
                    <span>Add Image</span>
                </Button>
            </div>
        </div>
    );
}
