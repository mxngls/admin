import { ColumnsData } from "../../../lib/types";

interface ProductTableHeadProps {
    columnsData: ColumnsData;
}

export default function ProductTableHead({
    columnsData,
}: ProductTableHeadProps) {
    return (
        <thead>
            <tr>
                <th className="sticky left-0 border-r-[1px] border-r-slate-200 bg-white p-3">
                    Main Image
                </th>
                {Object.keys(columnsData).map((column, index) => {
                    return (
                        <th
                            className={
                                "border-r-[1px] border-r-slate-200 bg-white p-3 last:border-r-0"
                            }
                            key={index + "-head"}
                        >
                            {column}
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}
