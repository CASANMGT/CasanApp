import React from "react";

// ─── Field label ────────────────────────────────────────────────

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
      {children}
    </label>
  );
}

// ─── Text input ─────────────────────────────────────────────────

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
  prefix,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
  prefix?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
          {prefix}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        disabled={disabled}
        className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-[#4DB6AC] focus:outline-none focus:ring-1 focus:ring-[#4DB6AC]/30 transition-colors disabled:bg-gray-50 disabled:text-gray-400 ${prefix ? "pl-12" : ""}`}
      />
    </div>
  );
}

// ─── Rupiah input (formatted) ───────────────────────────────────

export function RpInput({
  value,
  onChange,
  placeholder,
}: {
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
}) {
  const display = value > 0 ? value.toLocaleString("id-ID") : "";

  const handleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    onChange(digits ? parseInt(digits, 10) : 0);
  };

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">
        Rp
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder ?? "0"}
        className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-[#4DB6AC] focus:outline-none focus:ring-1 focus:ring-[#4DB6AC]/30 transition-colors"
      />
    </div>
  );
}

// ─── Pill selector ──────────────────────────────────────────────

export function PillSelector<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
            value === opt.value
              ? "bg-[#4DB6AC] text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Dropdown select ────────────────────────────────────────────

export function DropdownSelect({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-[#4DB6AC] focus:outline-none focus:ring-1 focus:ring-[#4DB6AC]/30 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat pr-10 ${
        !value ? "text-gray-400" : "text-gray-900"
      }`}
    >
      {placeholder && (
        <option value="">{placeholder}</option>
      )}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

// ─── Toggle switch ──────────────────────────────────────────────

export function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center gap-3 w-full"
    >
      <div
        className={`relative h-6 w-11 rounded-full transition-colors ${
          value ? "bg-[#4DB6AC]" : "bg-gray-200"
        }`}
      >
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </button>
  );
}

// ─── Section heading ────────────────────────────────────────────

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-bold text-gray-800 mb-4">{children}</h2>;
}

// ─── Info box ───────────────────────────────────────────────────

export function InfoBox({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "warning";
}) {
  const styles =
    variant === "warning"
      ? "bg-amber-50 border-amber-100 text-amber-700"
      : "bg-primary10 border-primary30 text-primaryDark";
  return (
    <div className={`rounded-xl border p-3 ${styles}`}>
      <p className="text-xs">{children}</p>
    </div>
  );
}

// ─── Asset toggle card ──────────────────────────────────────────

export function AssetCard({
  icon,
  label,
  active,
  onToggle,
  value,
  onValueChange,
}: {
  icon: string;
  label: string;
  active: boolean;
  onToggle: () => void;
  value?: number;
  onValueChange?: (v: number) => void;
}) {
  return (
    <div
      className={`rounded-xl border p-3 transition-colors ${
        active ? "border-[#4DB6AC] bg-[#4DB6AC]/5" : "border-gray-200 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2"
      >
        <span className="text-lg">{icon}</span>
        <span className="flex-1 text-left text-xs font-semibold text-gray-700">
          {label}
        </span>
        <div
          className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors ${
            active ? "border-[#4DB6AC] bg-[#4DB6AC]" : "border-gray-300 bg-white"
          }`}
        >
          {active && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </button>
      {active && onValueChange && (
        <div className="mt-2 pl-7">
          <RpInput
            value={value ?? 0}
            onChange={onValueChange}
            placeholder="Estimasi nilai"
          />
        </div>
      )}
    </div>
  );
}
