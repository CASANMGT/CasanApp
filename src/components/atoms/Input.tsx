import { useMemo } from "react";
import { REGEX_NUMBERS } from "../../common";
import { div } from "framer-motion/client";

interface InputProps {
  type?: "number" | "text" | "phone";
  placeholder: string;
  value: string;
  error?: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  autoFocus,
  value,
  error,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string = e?.target?.value;

    if (type === "phone") {
      value = value.replace(REGEX_NUMBERS, "");

      if (
        value &&
        (value.substring(0, 1) == "0" || value.substring(0, 2) == "62")
      )
        value = "";
    }

    onChange(value);
  };

  const isError = useMemo(() => (error ? true : false), [error]);

  return (
    <div>
      <div className={`w-full px-6 border border-baseGray rounded-full flex flex-row gap-2 items-center ${isError && "border-red"}`}>
        {type === "phone" && (
          <>
            <span>+62</span>
            <div className="w-px h-6 bg-baseGray" />
          </>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          autoFocus={autoFocus}
          onChange={handleChange}
          className="h-full w-full px-0 py-3 bg-transparent text-sm text-black100 focus:outline-none  "
        />
      </div>

      {isError && <span className="text-xs ml-6 text-red mt-1">{error}</span>}
    </div>
  );
};

export default Input;
