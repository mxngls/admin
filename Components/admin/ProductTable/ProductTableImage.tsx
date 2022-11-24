import Image from "next/image";
import { SleeperChair } from "iconoir-react";

interface ProductTableImageProps {
    mainImage: string | null;
    length: number;
    index: number;
}

export default function ProductTableImage({
    mainImage,
    length,
    index,
}: ProductTableImageProps) {
    return (
        <th
            className={`${
                index % 2 !== 0 ? "bg-white" : "bg-slate-50"
            } sticky left-0 z-10 flex items-center justify-center ${
                length - 1 !== index ? "border-b-[1px]" : ""
            } border-r-[1px] border-slate-200 p-2 text-center align-middle`}
        >
            {mainImage ? (
                <Image
                    className={"object-cover shadow-slate-900"}
                    layout="intrinsic"
                    height={60}
                    width={60}
                    alt={"Main Image"}
                    src={mainImage}
                />
            ) : (
                <div>
                    <SleeperChair
                        height={60}
                        width={60}
                        color={"rgb(203 213 225 / 1"}
                        strokeWidth={"0.8"}
                    />
                </div>
            )}
        </th>
    );
}
