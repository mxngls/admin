import { useEffect, useRef, useState } from "react";
import { InputError } from "./types";
import { ImageData } from "./types";

const capitalizeFirstLetter = (string: string, locale = navigator.language) => {
    const first = string.substring(0, 1);
    const rest = string.substring(1);
    if (first === undefined) {
        return "";
    } else {
        return first.toLocaleUpperCase(locale) + rest.toLocaleLowerCase();
    }
};

const formatValue = (attribute: string, value: string | number) => {
    if (attribute === "price") {
        return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
        }).format(value as number);
    }
    return value;
};

export { capitalizeFirstLetter, formatValue };
