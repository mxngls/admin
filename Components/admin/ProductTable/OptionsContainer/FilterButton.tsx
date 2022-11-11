import { Filter } from "iconoir-react";
import { Dispatch, SetStateAction } from "react";

interface FilterButtonProps {
    filterNumber: number;
    setFilterPopup: Dispatch<SetStateAction<boolean>>;
}

export default function SortButton({
    filterNumber,
    setFilterPopup,
}: FilterButtonProps) {
    return (
        <button
            type={"button"}
            onClick={(e) => {
                e.stopPropagation();
                setFilterPopup((current) => !current);
            }}
            className={`${
                filterNumber > 0 ? "hover:bg-green-50" : "hover:bg-slate-50"
            } flex flex-row items-center space-x-2 rounded px-3 py-2`}
        >
            <Filter color={`${filterNumber > 0 ? "rgb(34 197 94" : ""}`} />
            {filterNumber > 0 ? (
                <span className="hidden w-12 font-medium text-green-500 sm:block">
                    Filered
                </span>
            ) : (
                <span className="hidden w-12 font-medium sm:block">Filter</span>
            )}
        </button>
    );
}
