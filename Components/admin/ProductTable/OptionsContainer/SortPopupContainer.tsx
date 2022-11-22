import React, { Dispatch, SetStateAction, useState } from "react";
import ColumnList from "./ColumnList";
import { NavArrowDown } from "iconoir-react";
import ActiveRule from "./ActiveRule";
import { ColumnsData, SortRule } from "../../../../lib/types";

interface SortPopupContainerProps {
    columnsData: ColumnsData;
    sortRules: SortRule[];
    setSortRules: Dispatch<SetStateAction<SortRule[]>>;
    setSortPopup: Dispatch<SetStateAction<boolean>>;
}

export default function SortPopupContainer({
    columnsData,
    sortRules,
    setSortRules,
    setSortPopup,
}: SortPopupContainerProps) {
    const [showColumnList, setShowColumnList] = useState<boolean>(false);

    const addRule = (column: string) => {
        setSortRules((current) => [
            ...current,
            {
                column: column,
                ascending: true,
            },
        ]);
    };

    return (
        <div
            className={`absolute mt-2 flex-row items-center overflow-visible whitespace-nowrap rounded border-[1px] border-slate-200 bg-slate-50 px-2`}
        >
            <div className="justify-center-1 flex min-h-[3rem] min-w-full flex-col items-center justify-center">
                {sortRules.length === 0 ? (
                    <span className="mx-2 place-self-center self-start  text-left">
                        No rules applied
                    </span>
                ) : (
                    sortRules.map((rule, index) => {
                        return (
                            <ActiveRule
                                key={rule.column}
                                rule={rule}
                                index={index}
                                sortRules={sortRules}
                                setSortRules={setSortRules}
                                setSortPopup={setSortPopup}
                            />
                        );
                    })
                )}
            </div>
            <div className="mr-1 min-h-[2.5rem] w-full">
                <div className="relative">
                    <div className="border-t-[1px] border-slate-200 py-3">
                        <button
                            disabled={
                                Object.keys(columnsData).length ===
                                sortRules.length
                                    ? true
                                    : false
                            }
                            className="flex items-center rounded py-1 px-2 text-sm hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-slate-50"
                            onClick={() =>
                                setShowColumnList((current) => !current)
                            }
                        >
                            <span>Pick a Column to Sort by</span>
                            <NavArrowDown className="ml-1" />
                        </button>
                    </div>
                    {!!showColumnList && (
                        <div className="flex-col border-t-[1px] border-slate-200 py-1">
                            <ColumnList
                                columnsData={columnsData}
                                setShowColumnList={setShowColumnList}
                                current={sortRules}
                                onClickHandler={addRule}
                            />{" "}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
