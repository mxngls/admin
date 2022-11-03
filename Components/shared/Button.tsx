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
                className="box-border h-11 w-fit rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-slate-50 shadow-sm hover:bg-slate-800"
                onClick={onClickHandler}
            >
                {children}
            </button>
        );
    } else {
        return (
            <button
                type={type}
                className="box-border h-11 w-fit rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-slate-50 shadow-sm hover:bg-slate-800"
            >
                {children}
            </button>
        );
    }
}
