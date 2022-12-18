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
    <td
      className={`${
        index % 2 !== 0 ? "bg-white" : "bg-slate-50"
      } sticky left-0 top-0 z-10 ${
        length - 1 !== index ? "border-b-[1px]" : ""
      } border-r-[1px] border-slate-200 p-2 text-center align-middle`}
    >
      <div className={"flex justify-center items-center"}>
        {mainImage ? (
          <div>
            <Image
              className={"object-cover shadow-slate-900"}
              layout="intrinsic"
              height={60}
              width={60}
              alt={"Main Image"}
              src={mainImage}
            />
          </div>
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
      </div>
    </td>
  );
}
