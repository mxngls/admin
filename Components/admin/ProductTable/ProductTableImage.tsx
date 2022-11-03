import Image from "next/image";
import { SleeperChair } from "iconoir-react";

interface ProductTableImageProps {
    mainImage: string | null;
    index: number;
}

export default function ProductTableImage({
    mainImage,
    index,
}: ProductTableImageProps) {

    return (
        <td
            className={`${
                index % 2 !== 0 ? "bg-white" : "bg-slate-50"
            } sticky left-0 flex border-collapse items-center justify-center border-t-[1px] border-r-[1px] border-t-slate-200 border-r-slate-200 p-2 text-center align-middle`}
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
        </td>
    );
}
