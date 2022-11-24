import { formatValue } from "../../../lib/helpers";

interface ProductCell {
    attribute: string;
    value: string | number;
    type: "string" | "number";
    length: number;
    index: number;
}

export default function ProductTableCell({
    attribute,
    value,
    type,
    length,
    index,
}: ProductCell) {
    return (
        <td
            className={`w-32 text-ellipsis whitespace-nowrap border-r-[1px] border-slate-200 ${
                length - 1 !== index ? "border-b-[1px]" : ""
            } p-4 last:border-r-0`}
            key={index + "-cell"}
        >
            <div
                className={`${
                    type === "number" ? "items-center" : "items-start"
                } flex`}
            >
                <span
                    className={`block flex-1 overflow-hidden text-ellipsis whitespace-nowrap ${
                        type === "number" ? "text-center" : "text-left"
                    }`}
                >
                    {formatValue(attribute, value)}
                </span>
            </div>
        </td>
    );
}
