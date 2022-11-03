import { Sort } from "iconoir-react";
import { Dispatch, SetStateAction } from "react";

interface SortButtonProps {
    rulesNumber: number;
    setSortPopup: Dispatch<SetStateAction<boolean>>;
}

export default function SortButton({
    rulesNumber,
    setSortPopup,
}: SortButtonProps) {
    return (
        <button
            type="button"
            onClick={(e) => {
                e.stopPropagation();
                console.log(e.isPropagationStopped());
                setSortPopup((current) => !current);
            }}
            className={`${
                rulesNumber > 1 ? "hover:bg-green-50" : "hover:bg-slate-50"
            } flex flex-row items-center space-x-2 rounded px-3 py-2`}
        >
            <Sort color={`${rulesNumber > 1 ? "rgb(34 197 94" : ""}`} />
            {rulesNumber > 1 ? (
                <span className="hidden w-12 font-medium text-green-500 sm:block">
                    Sorted
                </span>
            ) : (
                <span className="hidden w-12 font-medium sm:block">
                    {"Sort"}
                </span>
            )}
        </button>
    );
}
