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
}

export default function ColumnList({
    columns,
    setShowColumnList,
    sortRules,
    setSortRules,
}: ColumnListProps) {
    return (
        <div className="text-sm flex flex-col p-2">
            {columns
                .filter(function (column) {
                    for (const rule of sortRules) {
                        if (rule.column === column) return false;
                    }
                    return true;
                })
                .map((column, index) => (
                    <button
                        onClick={() => {
                            setSortRules((current) => [
                                ...current,
                                {
                                    column: column,
                                    ascending: true,
                                },
                            ]);
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
