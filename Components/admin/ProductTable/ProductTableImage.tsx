import { useEffect, useState } from "react";
import Image from "next/image";
import { SleeperChair } from "iconoir-react";

interface ProductTableImageProps {
  mainImage: string | null;
  canScroll: boolean;
  last: boolean;
  index: number;
}

export default function ProductTableImage({
  mainImage,
  canScroll,
  last,
  index,
}: ProductTableImageProps) {
  const [bottomBorder, setBottomBorder] = useState(true);

  useEffect(() => {
    if (canScroll && last) {
      setBottomBorder(false);
    } else if (!canScroll && last) {
      setBottomBorder(true);
    } else setBottomBorder(true);
  }, [canScroll, last]);

  return (
    <td
      className={`w-32 border-r-[1px] border-slate-200 ${
        bottomBorder ? "border-b-[1px]" : "border-b-0"
      } p-4 last:border-r-0 ${
        index % 2 !== 0 ? "bg-white" : "bg-slate-50"
      } sticky left-0 top-0 z-10 border-r-[1px] border-slate-200 p-2 text-center align-middle`}
    >
      <div className={"flex items-center justify-center"}>
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
