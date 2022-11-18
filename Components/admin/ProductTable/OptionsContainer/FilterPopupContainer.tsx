import React, { Dispatch, SetStateAction } from "react";
import { Plus } from "iconoir-react";
import { ColumnsData, Filter } from "../../../../lib/types";
import ActiveFilter from "./ActiveFilter";

interface FilterPopupContainerProps {
    firstColumn: string;
    columnsData: ColumnsData;
    filters: Filter[];
    setFilters: Dispatch<SetStateAction<Filter[]>>;
    setFilterPopup: Dispatch<SetStateAction<boolean>>;
}

export default function FilterPopupContainer({
    columnsData,
    filters,
    setFilters,
    setFilterPopup,
}: FilterPopupContainerProps) {
    const addFilter = () => {
        setFilters((current) => {
            const columns = Object.keys(columnsData);
            const notFiltered = columns.filter((column) => {
                return current.some(
                    (filteredCol) => filteredCol.column === column
                )
                    ? false
                    : true;
            });
            return [
                ...current,
                { column: notFiltered[0], compare: "", type: "=" },
            ];
        });
    };

    return (
        <div
            className={`absolute mt-2 flex-row items-center overflow-visible whitespace-nowrap rounded border-[1px] border-slate-200 bg-slate-50 px-2`}
        >
            <div>
                <div className="flex min-h-[3rem] min-w-full flex-col items-center justify-center border-b-[1px] border-slate-200 py-1">
                    {filters.length === 0 ? (
                        <span className="mx-2 place-self-center self-start  text-left">
                            No filters applied
                        </span>
                    ) : (
                        filters.map((filter, index) => {
                            return (
                                <ActiveFilter
                                    key={`${filter.column}-${index}`}
                                    columnsData={columnsData}
                                    addFilter={addFilter}
                                    filterIndex={index}
                                    activeFilter={filter}
                                    filters={filters}
                                    setFilters={setFilters}
                                    setFilterPopup={setFilterPopup}
                                />
                            );
                        })
                    )}
                </div>
            </div>
            <div className="mr-1 flex min-h-[2.5rem] min-w-full flex-col">
                <div className="border-b-[1px] border-slate-200 py-2">
                    <button
                        className="flex items-center rounded py-1 px-2 text-sm hover:bg-slate-200"
                        onClick={() => {
                            addFilter();
                        }}
                    >
                        <span>Add a filter</span>
                        <Plus className="ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
