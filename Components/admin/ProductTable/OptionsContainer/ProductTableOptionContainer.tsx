import Button from "../../../shared/Button";
import { Plus } from "iconoir-react";
import { Dispatch, SetStateAction } from "react";
import { useClickOutside } from "../../../../lib/hooks";
import SortPopupContainer from "./SortPopupContainer";
import SortButton from "./SortButton";
import FilterButton from "./FilterButton";
import FilterPopupContainer from "./FilterPopupContainer";
import { ColumnsData, Filter, SortRule } from "../../../../lib/types";

interface ProductTableHeadProps {
    columnsData: ColumnsData;
    filters: Filter[];
    setFilters: Dispatch<SetStateAction<Filter[]>>;
    sortRules: SortRule[];
    setSortRules: Dispatch<SetStateAction<SortRule[]>>;
    filterPopup: boolean;
    setFilterPopup: Dispatch<SetStateAction<boolean>>;
    sortPopup: boolean;
    setSortPopup: Dispatch<SetStateAction<boolean>>;
}

export default function ProductTableOptionContainer({
    columnsData,
    filters,
    setFilters,
    sortRules,
    setSortRules,
    filterPopup,
    setFilterPopup,
    sortPopup,
    setSortPopup,
}: ProductTableHeadProps): JSX.Element {
    const sortPopupRef: React.RefObject<HTMLDivElement> = useClickOutside(() =>
        setSortPopup(false)
    );
    const filterPopupRef: React.RefObject<HTMLDivElement> = useClickOutside(
        () => setFilterPopup(false)
    );

    return (
        <div className="sticky left-0 z-10 flex w-full items-center justify-start space-x-6 border-b-[1px] border-slate-200 py-4 px-1 sm:space-x-12 sm:p-4">
            <div ref={filterPopupRef} className="relative">
                <FilterButton
                    filterNumber={filters.length}
                    setFilterPopup={setFilterPopup}
                />
                {filterPopup && (
                    <FilterPopupContainer
                        firstColumn={Object.keys(columnsData)[0]}
                        columnsData={columnsData}
                        filters={filters}
                        setFilters={setFilters}
                        setFilterPopup={setFilterPopup}
                    />
                )}
            </div>
            <div ref={sortPopupRef} className="relative">
                <SortButton
                    rulesNumber={sortRules.length}
                    setSortPopup={setSortPopup}
                />
                {sortPopup && (
                    <SortPopupContainer
                        columnsData={columnsData}
                        sortRules={sortRules}
                        setSortRules={setSortRules}
                        setSortPopup={setSortPopup}
                    />
                )}
            </div>
            <Button type={"button"}>
                <Plus className="float-left" />
                <span className="overflow-hidden whitespace-nowrap">
                    Add Product
                </span>
            </Button>
        </div>
    );
}