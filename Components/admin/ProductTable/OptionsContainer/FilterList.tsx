import { Dispatch, SetStateAction } from "react";
import { useClickOutside } from "../../../../lib/hooks";
import { Filter } from "../../../../lib/types";

interface FilterListProps {
    currentIndex: number;
    setFilters: Dispatch<SetStateAction<Filter[]>>;
    setShowFilterList: Dispatch<SetStateAction<boolean>>;
    activeFilter: Filter;
}

export default function FilterList({
    currentIndex,
    setFilters,
    activeFilter,
    setShowFilterList,
}: FilterListProps) {
    const filterList = [
        ["=", "equal"],
        ["<>", "not equal"],
        [">", "greater than"],
        ["<", "less than"],
        [">=", "greater than or equal"],
        ["<=", "less than or equal"],
        ["in", "one of a list of values"],
    ];

    return (
        <ul className="w-full">
            {filterList.map((filter, index) => {
                return (
                    <li key={`active_filter-${index}`}>
                        <button
                            className="flex w-full rounded px-2 py-1 text-left hover:bg-slate-200"
                            onClick={() => {
                                setFilters((current) =>
                                    current.map((item, index) => {
                                        if (index === currentIndex) {
                                            return {
                                                ...item,
                                                type: filter[0],
                                            } as Filter;
                                        }
                                        return item;
                                    })
                                );
                                setShowFilterList(false);
                            }}
                        >
                            <span className="text-slate-400">
                                [ {filter[0]} ]
                            </span>
                            <span className="ml-2">{filter[1]}</span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
