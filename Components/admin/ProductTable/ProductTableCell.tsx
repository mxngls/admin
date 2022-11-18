import { formatValue } from "../../../lib/helpers";

interface ProductCell {
    attribute: string;
    value: string | number;
    type: "string" | "number";
    index: number;
}

export default function ProductTableCell({
    attribute,
    index,
    value,
    type,
}: ProductCell) {
    return (
        <td
            className={
                "max-w-[100px] border-t-[1px] border-r-[1px] border-t-slate-200 border-r-slate-200 p-4 last:border-r-0"
            }
            key={index + "-cell"}
        >
            <div
                className={`${
                    type === "number" ? "items-center" : "items-start"
                } flex`}
            >
                <span
                    className={`block w-24 flex-1 overflow-hidden text-ellipsis whitespace-nowrap ${
                        type === "number" ? "text-center" : "text-left"
                    }`}
                >
                    {formatValue(attribute, value)}
                </span>
            </div>
        </td>
    );
}
