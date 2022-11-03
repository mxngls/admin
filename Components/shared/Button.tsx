import { type } from "os";
import React from "react";

interface ButtonProps {
    onClickHandler?: React.MouseEventHandler<HTMLButtonElement>;
    type: "button" | "submit" | "reset";
    children?: JSX.Element | JSX.Element[];
}

export default function Button({
    onClickHandler,
    type,
    children,
}: ButtonProps) {
    if (type === "button") {
        return (
            <button
                type={type}
                className="box-border flex flex-nowrap items-center space-x-2 rounded-md bg-slate-800 px-3 py-2 text-center text-sm font-medium text-slate-50 shadow-sm hover:bg-slate-700"
                onClick={onClickHandler}
            >
                {children}
            </button>
        );
    } else {
        return (
            <button
                type={type}
                className="box-border flex flex-nowrap items-center space-x-2 rounded-md bg-slate-800 px-3 py-2 text-center text-sm font-medium text-slate-50 shadow-sm hover:bg-slate-700"
            >
                {children}
            </button>
        );
    }
}
