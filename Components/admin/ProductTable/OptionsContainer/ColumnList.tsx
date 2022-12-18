import { Dispatch, SetStateAction } from "react";
import { ColumnsData, Filter, SortRule } from "../../../../lib/types";

interface ColumnListProps {
  columnsData: ColumnsData;
  setShowColumnList: Dispatch<SetStateAction<boolean>>;
  current: SortRule[] | Filter[];
  onClickHandler: Function;
}

export default function ColumnList({
  columnsData,
  setShowColumnList,
  current,
  onClickHandler,
}: ColumnListProps) {
  const checkCurrentRules = (
    column: string,
    current: SortRule[] | Filter[]
  ) => {
    for (let element of current) {
      if (element.column === column) return false;
    }
    return true;
  };

  return (
    <div className="flex flex-col p-2 text-sm">
      <ul className="w-full list-inside list-none">
        {Object.keys(columnsData)
          .filter((column) => checkCurrentRules(column, current))
          .map((column, index) => {
            return (
              <li key={`${column}-${index}`} className="w-full">
                <button
                  onClick={() => {
                    onClickHandler(column);
                    setShowColumnList(false);
                  }}
                  className="block w-full rounded px-4 py-1 text-left hover:bg-slate-200"
                  key={`col-${index}`}
                >
                  <span>{column}</span>
                  <span className="ml-2 text-slate-400">
                    {columnsData[column].type}
                  </span>
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
