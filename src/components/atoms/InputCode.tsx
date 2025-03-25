import { useMemo } from "react";
import { IcInfoRed } from "../../assets";

interface InputCodeProps {
  type?: "number" | "password";
  values: string[];
  error?: string;
  onChange: (value: string[]) => void;
}

const InputCode: React.FC<InputCodeProps> = ({
  type = "number",
  values,
  error,
  onChange,
}) => {
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Ensure only one character per box
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);

    // Automatically focus the next input if available
    if (value && index < values.length - 1) {
      const nextInput = document.getElementById(`input-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow Backspace, Delete, Tab, Arrow keys, and Enter
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Enter",
    ];
    if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault(); // Block non-numeric input
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  const isError = useMemo(() => (error ? true : false), [error]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-row items-center gap-2">
        {values.map((value, index: number) => (
          <input
            key={index}
            className={`w-10 h-10 border border-baseGray rounded-lg center text-center text-2xl font-bold focus:outline-primary100 bg-white dark:bg-darkMode ${
              isError ? "border-red" : ""
            }`}
            id={`input-box-${index}`}
            type={type}
            maxLength={1}
            value={value}
            autoFocus={index === 0 ? true : false}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={handleKeyDown}
            onWheel={handleWheel}
          />
        ))}
      </div>
      {isError && (
        <div className="flex flex-row items-center gap-1 mt-4">
          <IcInfoRed />
          <span className="text-xs text-red">{error}</span>
        </div>
      )}
    </div>
  );
};

export default InputCode;
