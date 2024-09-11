import { useRef, useEffect, SetStateAction, Dispatch } from "react";
import { convertNumberType } from "../../../../lib/helpers";
import { useClickOutside } from "../../../../lib/hooks";
import { ColumnsData } from "../../../../lib/types";
import Button from "../../../shared/Button";
import InputProductAttribute from "../InputProductAttribute";

interface ProductUploadDialogProps {
  openDialog: Boolean;
  setOpenDialog: Dispatch<SetStateAction<Boolean>>;
  columnsData: ColumnsData;
}

export default function ImageUploadDialog({
  openDialog,
  setOpenDialog,
  columnsData,
}: ProductUploadDialogProps) {
  // let err = useProductAttributeError(content, type);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const formRef: React.RefObject<HTMLFormElement> = useClickOutside(() => {
    setOpenDialog(false);
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!openDialog && dialog) {
      dialog.close();
    } else if (!!openDialog && dialog) {
      dialog.showModal();
    }
    return () => dialog?.close();
  }, [dialogRef, openDialog]);

  return (
    <dialog
      ref={dialogRef}
      className="rounded border-slate-400 px-10 py-12 text-sm transition duration-150 ease-in-out backdrop:bg-gray-800 backdrop:opacity-40 sm:text-base"
    >
      <div>
        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex h-full w-full flex-col items-center justify-center gap-4"
          ref={formRef}
        >
          {Object.keys(columnsData).map((key: string, index: number) => {
            if (key !== "product_id") {
              return (
                <InputProductAttribute
                  key={index}
                  type={convertNumberType(columnsData[key].type)}
                  column={key}
                  attribute={""}
                />
              );
            }
          })}
          <Button type="submit">
            <span>Add</span>
          </Button>
        </form>
      </div>
    </dialog>
  );
}
