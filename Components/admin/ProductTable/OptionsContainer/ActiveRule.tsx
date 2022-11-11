import { Cancel } from "iconoir-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SortRule } from "../../../../lib/types";

interface ActiveRuleProps {
    rule: SortRule;
    index: number;
    sortRules: SortRule[];
    setSortRules: Dispatch<SetStateAction<SortRule[]>>;
    setSortPopup: Dispatch<SetStateAction<boolean>>;
}

export default function ActiveRule({
    rule,
    index,
    sortRules,
    setSortPopup,
    setSortRules,
}: ActiveRuleProps) {
    // useEffect(() => {
    //     console.log(rule, index);
    // })

    return (
        <div className="flex min-h-[3rem] min-w-full flex-col items-start justify-start border-b-[1px] border-slate-200 py-2 last:border-none sm:m-0 sm:flex-row sm:items-center sm:border-none">
            <div className="flex items-center justify-start">
                <button className="mr-1 rounded hover:bg-slate-200">
                    <Cancel
                        height={"20px"}
                        width={"20px"}
                        onClick={() => {
                            setSortRules((current) =>
                                current.filter((a) => a.column !== rule.column)
                            );
                        }}
                    />
                </button>
                <span className="text-slate-400">Sorted by: </span>
                <span className="ml-1 mr-16">{rule.column}</span>
            </div>
            <div className="ml-auto">
                <label
                    htmlFor={`toggleSort-${rule.column}`}
                    className="inline-flex cursor-pointer items-center"
                >
                    <span className="mr-2 text-slate-400">ascending:</span>
                    <div
                        className={`relative flex w-full items-center justify-center rounded-full p-1 duration-75 ease-in-out ${
                            rule.ascending ? "hover:bg-green-200" : ""
                        }`}
                    >
                        <input
                            onChange={(e) => {
                                console.log("clicked");
                                setSortRules((current) => [
                                    ...current.map((r, n) => {
                                        console.log(
                                            r.column + " | " + rule.column
                                        );
                                        if (index === n) {
                                            return {
                                                ...rule,
                                                ascending: !rule.ascending,
                                            };
                                        } else {
                                            return r;
                                        }
                                    }),
                                ]);
                            }}
                            type="checkbox"
                            name="toggleSort"
                            value="toggleSort"
                            id={`toggleSort-${rule.column}`}
                            className="sr-only"
                            checked={rule.ascending}
                        />
                        <div
                            className={`block h-6 w-10 rounded-full ${
                                rule.ascending ? "bg-green-500" : "bg-slate-600"
                            }`}
                        ></div>
                        <div
                            className={`${
                                rule.ascending
                                    ? "translate-x-4 bg-white"
                                    : "bg-slate-400"
                            } absolute left-2 h-4 w-4 rounded-full transition`}
                        ></div>
                    </div>
                </label>
            </div>
        </div>
    );
}
