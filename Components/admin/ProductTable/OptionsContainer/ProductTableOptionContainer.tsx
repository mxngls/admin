import Button from "../../../shared/Button";
import { Plus } from "iconoir-react";
import { Dispatch, SetStateAction } from "react";
import { useClickOutside } from "../../../../lib/hooks";
import SortPopupContainer from "./SortPopupContainer";
import SortButton from "./SortButton";
import FilterButton from "./FilterButton";
import { ColumnsData, Filter, SortRule } from "../../../../lib/types";

interface ProductTableHeadProps {
    columnsData: ColumnsData;
    sortRules: SortRule[];
    setSortRules: Dispatch<SetStateAction<SortRule[]>>;
    sortPopup: boolean;
    setSortPopup: Dispatch<SetStateAction<boolean>>;
}

export default function ProductTableOptionContainer({
    columnsData,
    sortRules,
    setSortRules,
    sortPopup,
    setSortPopup,
}: ProductTableHeadProps): JSX.Element {
    const popupDiv: React.RefObject<HTMLDivElement> = useClickOutside(() =>
        setSortPopup(false)
    );

    return (
        <div className="sticky left-0 z-10 flex w-full items-center justify-start space-x-6 border-b-[1px] border-slate-200 py-4 px-1 sm:space-x-12 sm:p-4">
            <FilterButton />
            <div ref={popupDiv} className="relative">
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
