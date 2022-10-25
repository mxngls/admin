import { useEffect, useRef, useState } from "react";
import { InputError } from "./types";
import { ImageData } from "./types";

const useClickOutside = <T extends HTMLElement>(handler: Function) => {
    const domNode = useRef<T>(null);

    useEffect(() => {
        const effectHandler = (e: Event) => {
            if (!domNode.current?.contains(e.target as Node)) {
                handler();
            }
        };

        document.addEventListener("mousedown", effectHandler);

        return () => {
            document.removeEventListener("mousedown", effectHandler);
        };
    });

    return domNode;
};

const useProductAttributeError = (
    content: string | number,
    type: string | number
) => {
    const [err, setErr] = useState<InputError>({
        isErr: false,
        message: "",
    });

    useEffect(() => {
        if (content === 0 || content === "") {
            setErr({
                isErr: true,
                message: "Please insert a value",
            });
        } else if (typeof content !== type) {
            setErr({
                isErr: true,
                message: `Please insert a ${type}`,
            });
        } else setErr({ isErr: false, message: "" });
    }, [content, type]);

    return err;
};

const useImageFileError = (file: File | null, fileName: string) => {
    const [err, setErr] = useState<InputError>({
        isErr: false,
        message: "",
    });

    useEffect(() => {
        if (!fileName && file) {
            setErr({
                isErr: true,
                message: "Please choose a file name",
            });
        } else if (fileName && !file) {
            setErr({
                isErr: true,
                message: "Choose an image",
            });
        } else setErr({ isErr: false, message: "" });
    }, [file, fileName]);

    return err;
};

const capitalizeFirstLetter = (string: string, locale = navigator.language) => {
    const first = string.substring(0, 1);
    const rest = string.substring(1);
    if (first === undefined) {
        return "";
    } else {
        return first.toLocaleUpperCase(locale) + rest.toLocaleLowerCase();
    }
};

export {
    useClickOutside,
    capitalizeFirstLetter,
    useProductAttributeError,
    useImageFileError,
};
