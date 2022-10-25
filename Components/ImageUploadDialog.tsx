import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import { useClickOutside, useImageFileError } from "../lib/helpers";
import Button from "./Button";
import toast from "react-hot-toast";
import { insertImageData, uploadImage } from "../lib/queries";
import { ImageData } from "../lib/types";

interface ImageUploadDialogProps {
    images: ImageData[];
    setImages: Dispatch<SetStateAction<ImageData[]>>;
    openDialog: Boolean;
    setOpenDialog: Dispatch<SetStateAction<Boolean>>;
    id: number;
}

export default function ImageUploadDialog({
    images,
    setImages,
    openDialog,
    setOpenDialog,
    id,
}: ImageUploadDialogProps) {
    const [fileName, setFileName] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const formRef: React.RefObject<HTMLFormElement> = useClickOutside(() => {
        setOpenDialog(false);
    });

    let err = useImageFileError(file, fileName);

    useEffect(() => {
        setFile(null);
    }, [openDialog]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!openDialog && dialog) {
            setFileName("");
            setFile(null);
            dialog.close();
        } else if (!!openDialog && dialog) {
            dialog.showModal();
        }
        return () => dialog?.close();
    }, [formRef, openDialog]);

    useEffect(() => {
        if (file) setFileName(file.name);
    }, [file]);

    const handleOnChangeFileName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(e.currentTarget.value);
    };

    const handleOnChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files![0]);
    };

    const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!err.isErr && !!file && !!fileName) {
            setOpenDialog(false);
            await toast.promise(
                uploadImage(file, fileName)
                    .then(() => {
                        if (images.length > 0) {
                            return insertImageData(id, fileName);
                        } else {
                            return insertImageData(id, fileName, true);
                        }
                    })
                    .then((images) =>
                        setImages((prevImages) =>
                            [...prevImages, images].sort(
                                (a, b) => a.primary - b.primary
                            )
                        )
                    ),
                {
                    loading: "Loading...",
                    success: "Uploaded Image!",
                    error: (error) => {
                        console.log("error", error);
                        return error;
                    },
                }
            );
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className="h-80 w-64 rounded border-slate-400 text-sm drop-shadow-lg transition duration-150 ease-in-out backdrop:bg-gray-800 backdrop:opacity-40 sm:text-base"
        >
            <form
                ref={formRef}
                className="flex h-full w-full flex-col items-center justify-center gap-6"
                method="dialog"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                    handleOnSubmit(e)
                }
            >
                <div className="flex h-24 flex-col items-center justify-start">
                    <input
                        autoCorrect="off"
                        spellCheck={false}
                        className={`${
                            err.isErr &&
                            "rounded border-2 border-pink-500 text-pink-600 focus:border-pink-500"
                        } mb-2 rounded border-2 border-slate-400 p-4 text-slate-700 placeholder:text-gray-400 focus:rounded focus:border-2 focus:border-slate-700`}
                        type="text"
                        placeholder={
                            !file ? "Please insert a filename" : fileName
                        }
                        value={fileName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleOnChangeFileName(e)
                        }
                    />
                    {err.isErr && (
                        <span className="text-pink-600">{err.message}</span>
                    )}
                </div>
                <input
                    ref={inputRef}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleOnChangeFile(e)
                    }
                    accept="image/jpeg"
                    type="file"
                    hidden={true}
                />
                <button
                    className="font-bold text-blue-500"
                    type="button"
                    onClick={() => inputRef.current!.click()}
                >
                    Choose File
                </button>
                <Button type="submit" content={"Upload Image"} />
            </form>
        </dialog>
    );
}
