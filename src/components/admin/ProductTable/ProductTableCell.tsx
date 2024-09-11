import { useEffect, useState } from "react";
import { formatValue } from "../../../lib/helpers";

interface ProductCell {
  canScroll: boolean;
  attribute: string;
  value: string | number | boolean;
  type: "string" | "number";
  index: number;
  last: boolean;
}

export default function ProductTableCell({
  canScroll,
  attribute,
  value,
  type,
  index,
  last,
}: ProductCell) {
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
      } p-4 last:border-r-0`}
      key={index + "-cell"}
    >
      <div
        className={`${type === "number" ? "items-center" : "items-start"} flex`}
      >
        {type === "number" || type === "string" ? (
          <span
            className={`block flex-1 overflow-hidden text-ellipsis whitespace-nowrap ${
              type === "number" || value === null ? "text-center" : "text-left"
            }`}
          >
            {typeof value !== "boolean" && formatValue(attribute, value)}
          </span>
        ) : type === "boolean" ? (
          <span className="flex flex-1 items-center justify-center">
            {value ? "Yes" : "No"}
          </span>
        ) : (
          ""
        )}
      </div>
    </td>
  );
}
