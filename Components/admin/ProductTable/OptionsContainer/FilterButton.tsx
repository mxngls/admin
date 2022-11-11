import { Filter } from "iconoir-react";

// interface SortButtonProps {
//     sortRules: { column: string; ascending: boolean };
//     setSortRules: Dispatch<
//         SetStateAction<{ column: string; ascending: boolean }>
//     >;
//     setSortPopup: Dispatch<SetStateAction<Boolean>>;
// }

export default function SortButton() {
    return (
        <button className="flex flex-row items-center space-x-2 rounded px-3 py-2 hover:bg-slate-50">
            <Filter />
            <span className="hidden font-medium sm:block">Filter</span>
        </button>
    );
}