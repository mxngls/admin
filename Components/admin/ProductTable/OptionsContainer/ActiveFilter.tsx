import { Cancel, NavArrowDown } from "iconoir-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useClickOutside } from "../../../../lib/hooks";
import { ColumnsData, Filter } from "../../../../lib/types";
import ColumnList from "./ColumnList";
import FilterList from "./FilterList";

interface ActiveFilterProps {
    columnsData: ColumnsData;
    addFilter: Function;
    filterIndex: number;
    activeFilter: Filter;
    filters: Filter[];
    setFilters: Dispatch<SetStateAction<Filter[]>>;
    setFilterPopup: Dispatch<SetStateAction<boolean>>;
}

export default function ActiveFilter({
    columnsData,
    addFilter,
    filterIndex,
    activeFilter,
    filters,
    setFilters,
    setFilterPopup,
}: ActiveFilterProps) {
    const [showFilterList, setShowFilterList] = useState<boolean>(false);
    const [showColumnList, setShowColumnList] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState<string | number>(
        activeFilter.compare
    );

    const filterListRef: React.RefObject<HTMLDivElement> = useClickOutside(() =>
        setShowFilterList(false)
    );

    const columnListRef: React.RefObject<HTMLDivElement> = useClickOutside(() =>
        setShowColumnList(false)
    );

    const changeFilterColumn = (column: string, currentIndex: number) => {
        setFilters((current) =>
            current.map((item, index) => {
                if (filterIndex === index) {
                    return {
                        ...item,
                        column: column,
                    } as Filter;
                }
                return item;
            })
        );
    };

    const handleOnChange = (event: React.FormEvent<HTMLInputElement>) => {
        setFilterValue(event.currentTarget.value);
    };

    return (
        <div className="flex flex-row items-center border-b-[1px] border-slate-200 py-2 last:border-none">
            <div className="flex flex-1 flex-col items-stretch gap-y-2 sm:flex-row sm:gap-y-0 sm:gap-x-2">
                <div ref={columnListRef} className="relative flex flex-auto">
                    <button
                        className="flex flex-1 rounded border-[1px] border-slate-300 bg-slate-100 px-2 py-1 text-sm hover:border-slate-400 focus:ring-1 focus:ring-slate-300"
                        onClick={(event) => {
                            setShowColumnList((current) => !current);
                        }}
                    >
                        <NavArrowDown
                            className="text-slate-400"
                            height={"20px"}
                            width={"20px"}
                        />
                        <span className="mx-1">{activeFilter.column}</span>
                    </button>
                    {!!showColumnList && (
                        <div className="absolute top-9 z-50 rounded border-[1px] border-slate-200 bg-slate-100">
                            <ColumnList
                                columnsData={columnsData}
                                setShowColumnList={setShowColumnList}
                                current={filters}
                                onClickHandler={changeFilterColumn}
                            />
                        </div>
                    )}
                </div>
                <div ref={filterListRef} className="relative">
                    <button
                        className="flex w-20 justify-around rounded border-[1px] border-slate-300 bg-slate-100 py-1 px-2 text-sm hover:border-slate-400 focus:ring-1 focus:ring-slate-300"
                        onClick={(event) => {
                            setShowFilterList((current) => !current);
                        }}
                    >
                        <NavArrowDown
                            className="text-slate-400"
                            height={"20px"}
                            width={"20px"}
                        />
                        <span className="mx-1">[ {activeFilter.type} ]</span>
                    </button>
                    {!!showFilterList && (
                        <div className="absolute top-9 z-50 rounded border-[1px] border-slate-200 bg-slate-100 p-3 text-sm">
                            <FilterList
                                currentIndex={filterIndex}
                                setFilters={setFilters}
                                activeFilter={activeFilter}
                                setShowFilterList={setShowFilterList}
                            />
                        </div>
                    )}
                </div>
                <div className="flex flex-1 items-center">
                    <form onSubmit={(event) => event.preventDefault()}>
                        <input
                            onChange={(event) => {
                                handleOnChange(event);
                                setFilters((current) =>
                                    current.map((item) => {
                                        if (
                                            item.column === activeFilter.column
                                        ) {
                                            return {
                                                ...item,
                                                compare: event.target.value,
                                            };
                                        }
                                        return item;
                                    })
                                );
                            }}
                            value={filterValue}
                            type={"text"}
                            className="w-28 min-w-0 rounded border-[1px] border-slate-300 bg-slate-100 px-2 py-1 text-sm placeholder-slate-400 outline-none hover:border-slate-400 focus:ring-1 focus:ring-slate-300"
                            placeholder="Enter value"
                        />
                    </form>
                </div>
            </div>
            <button className="m-1 mx-2 self-start rounded hover:bg-slate-200 sm:m-0 sm:mx-1 sm:self-center">
                <Cancel
                    height={"20px"}
                    width={"20px"}
                    onClick={() => {
                        setFilters((current) => {
                            let copy = [...current];
                            copy.splice(filterIndex, 1);
                            return copy;
                        });
                    }}
                />
            </button>
        </div>
    );
}
