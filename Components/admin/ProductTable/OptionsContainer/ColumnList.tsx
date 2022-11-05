import { Dispatch, SetStateAction } from "react";

interface SortRule {
    column: string;
    ascending: boolean;
}

interface ColumnListProps {
    columns: string[];
    setShowColumnList: Dispatch<SetStateAction<boolean>>;
    sortRules: SortRule[];
    setSortRules: Dispatch<SetStateAction<SortRule[]>>;
    onClickHandler: Function;
}

export default function ColumnList({
    columns,
    setShowColumnList,
    sortRules,
    setSortRules,
    onClickHandler,
}: ColumnListProps) {
    const checkCurrentRules = (column: string) => {
        for (const rule of sortRules) {
            if (rule.column === column) return false;
        }
        return true;
    };

    return (
        <div className="flex flex-col p-2 text-sm">
            {columns
                .filter((column) => checkCurrentRules(column))
                .map((column, index) => (
                    <button
                        onClick={() => {
                            onClickHandler(column);
                            setShowColumnList(false);
                        }}
                        className="block rounded px-4 py-1 text-left hover:bg-slate-200"
                        key={`col-${index}`}
                    >
                        {column}
                    </button>
                ))}
        </div>
    );
}
