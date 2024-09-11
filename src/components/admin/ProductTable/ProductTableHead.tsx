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
        <th className="sticky left-0  top-[11.75rem] z-20 w-32 border-b-[1px] border-t-[1px] border-r-[1px] border-slate-200 bg-white p-3 xxs:top-[8.25rem] sm:top-[8.25rem] md:top-[5.134rem]">
          Main Image
        </th>
        {Object.keys(columnsData).map((column, index) => {
          return (
            <th
              className={
                "sticky  top-[11.75rem] z-10 w-32 border-b-[1px] border-r-[1px] border-t-[1px] border-slate-200 bg-white p-3 last:border-r-0 xxs:top-[8.25rem] sm:top-[8.25rem] md:top-[5.134rem]"
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
