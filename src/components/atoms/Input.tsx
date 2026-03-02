import { useMemo } from "react";
import { REGEX_NUMBERS } from "../../common";

interface InputProps {
  type?: "number" | "text" | "phone";
  inputMode?:
    | "text"
    | "search"
    | "email"
    | "tel"
    | "url"
    | "none"
    | "numeric"
    | "decimal"
    | undefined;
  placeholder?: string;
  label?: string;
  labelExtra?: string;
  value: string;
  error?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  label,
  labelExtra,
  inputMode,
  placeholder,
  autoFocus,
  value,
  error,
  disabled,
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

  const isShowLabel = useMemo(() => (label ? true : false), [label]);
  const isShowLabelExtra = useMemo(
    () => (labelExtra ? true : false),
    [labelExtra],
  );
  const isError = useMemo(() => (error ? true : false), [error]);

  return (
    <div className="flex flex-col w-full">
      {isShowLabel && (
        <div className="row mb-1 gap-1">
          <label>{label}</label>
          {isShowLabelExtra && (
            <p className="text-black50">({labelExtra})</p>
          )}
        </div>
      )}

      <div
        className={`w-full h-12 px-4 border border-black10 rounded-xl shadow flex flex-row gap-2 items-center ${
          isError && "border-red"
        } ${disabled && "!bg-black10"}`}
      >
        {type === "phone" && (
          <>
            <span>+62</span>
            <div
              className="w-px h-6"
              style={{
                backgroundColor: disabled ? "#d9dadd" : "#F5F5F5",
              }}
            />
          </>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          inputMode={inputMode}
          autoFocus={autoFocus}
          disabled={disabled}
          onChange={handleChange}
          className="h-full w-full px-0 py-0 bg-transparent text-sm text-black100 placeholder-black50 focus:outline-none  disabled:text-black90 disabled:cursor-not-allowed"
        />
      </div>

      {isError && <span className="text-xs text-red mt-1">{error}</span>}
    </div>
  );
};

export default Input;
