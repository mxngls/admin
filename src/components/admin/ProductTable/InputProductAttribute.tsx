import { useState } from "react";
import { useProductAttributeError } from "../../../lib/hooks";

interface InputProductAttributeProps {
  column: string;
  attribute: string;
  type: string;
}

export default function InputProductAttribute({
  column,
  type,
  attribute,
}: InputProductAttributeProps) {
  const [content, setContent] = useState<string | number>(attribute);

  let err = useProductAttributeError(content, type);

  const handleChangeContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      const number = Number(event.target.value)
        ? parseInt(event.target.value)
        : event.target.value;
      setContent(number);
    } else {
      setContent(event.target.value);
    }
  };

  return (
    <div className="flex flex-col items-start justify-center">
      <label>{column}</label>
      <input
        onChange={(event) => handleChangeContent(event)}
        value={content}
        className="mt-2 rounded border-[1px] p-2 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-200"
      ></input>
      <div className="mt-2 h-6">
        {err.isErr && <span className="text-pink-600">{err.message}</span>}
      </div>
    </div>
  );
}
