import Button from "../../../shared/Button";
import { Plus } from "iconoir-react";
import ProductUploadDialog from "./ProductUploadDialog";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useClickOutside } from "../../../../lib/hooks";
import SortPopupContainer from "./SortPopupContainer";
import SortButton from "./SortButton";
import FilterButton from "./FilterButton";
import FilterPopupContainer from "./FilterPopupContainer";
import { ColumnsData, Filter, SortRule } from "../../../../lib/types";

interface ProductTableHeadProps {
    columnsData: ColumnsData;
    term: string;
    setTerm: Dispatch<SetStateAction<string>>;
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
    term,
    setTerm,
    filters,
    setFilters,
    sortRules,
    setSortRules,
    filterPopup,
    setFilterPopup,
    sortPopup,
    setSortPopup,
}: ProductTableHeadProps): JSX.Element {
    const [openDialog, setOpenDialog] = useState<Boolean>(false);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTerm(event.target.value);
    };

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
            <input
                onChange={(event) => handleOnChange(event)}
                value={term}
                placeholder={"Enter a keyword"}
                className="left-0 h-[44px] w-40 rounded border-[1px] border-slate-300 p-2 placeholder-slate-400 outline-none hover:border-slate-400 focus:ring-1 focus:ring-slate-300"
            ></input>
            <div className="flex flex-row top-0 items-center h-[44px]">
                <Button
                    type={"button"}
                    onClickHandler={() => setOpenDialog(true)}
                >
                <Plus className="float-left" />
                <span className="overflow-hidden whitespace-nowrap">
                    Add Product
                </span>
            </Button>
        </div>
    );
}