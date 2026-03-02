import { useEffect, useMemo, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";

interface UploadImageProps {
  label?: string;
  className?: string;
  value: File | string | undefined;
  error?: string;
  onChange: (select: File | undefined) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({
  className,
  label,
  value,
  error,
  onChange,
}) => {
  const [previewSource, setPreviewSource] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null);

  useEffect(() => {
    // Reset if no value
    if (!value) {
      setPreviewSource(null);
      setFileType(null);
      return;
    }

    // ---- CASE 1: value is File ----
    if (value instanceof File) {
      if (value.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(value);
        setPreviewSource(objectUrl);
        setFileType("image");

        return () => URL.revokeObjectURL(objectUrl);
      }

      if (value.type === "application/pdf") {
        const objectUrl = URL.createObjectURL(value);
        setPreviewSource(objectUrl);
        setFileType("pdf");

        return () => URL.revokeObjectURL(objectUrl);
      }
    }

    // ---- CASE 2: value is string (URL or path) ----
    if (typeof value === "string") {
      const lower = value.toLowerCase();

      if (lower.endsWith(".pdf")) {
        setPreviewSource(value);
        setFileType("pdf");
      } else {
        setPreviewSource(value);
        setFileType("image");
      }
    }
  }, [value]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target?.files?.[0];

      const validTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
      ];
      if (file && !validTypes.includes(file.type)) {
        alert("Only PNG, JPG, and PDF files are allowed.");
        return;
      }

      if (file) onChange(file);
    } catch (error) {}
  };

  const isError = useMemo(() => (error ? true : false), [error]);

  return (
    <div className={`flex flex-col  ${className}`}>
      {/* Upload Button */}
      {!previewSource ? (
        <label className="h-9 flex gap-3 text-primary100 font-semibold border border-primary100 rounded-full px-7 items-center justify-center cursor-pointer">
          Upload {label}
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleImageUpload}
          />
          <FiUpload size={16} />
        </label>
      ) : (
        // Image Preview
        <div className="relative max-w-25 h-auto">
          {fileType === "image" && previewSource && (
            <div className="space-y-1">
              <label>{label}</label>
              <img
                src={previewSource}
                alt="Uploaded Preview"
                className="w-full h-auto aspect-video object-cover rounded-lg border"
              />
            </div>
          )}

          {fileType === "pdf" && previewSource && (
            <embed
              src={previewSource}
              type="application/pdf"
              className="w-[68px] h-[68px] border rounded-lg"
            />
          )}

          <button
            onClick={() => onChange(undefined)}
            className="absolute top-4 -right-2 bg-white rounded-full"
          >
            <IoCloseCircleOutline size={26} className="text-red" />
          </button>
        </div>
      )}

      {isError && <span className="text-red">{error}</span>}
    </div>
  );
};

export default UploadImage;
