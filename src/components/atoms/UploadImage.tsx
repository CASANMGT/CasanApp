import { useEffect, useMemo, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { isHttpUrl } from "../../helpers";

interface Props {
  label?: string;
  placeholder?: string;
  className?: string;
  value: File | string | undefined;
  error?: string;
  onChange: (select: File | null) => void;
}

const UploadImage: React.FC<Props> = ({
  className,
  label,
  value,
  error,
  placeholder,
  onChange,
}) => {
  const [imageSource, setImageSource] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      try {
        const cloneFile: File = value as File;

        if (cloneFile?.type?.startsWith("image/")) {
          const fileUrl = URL.createObjectURL(cloneFile);
          setImageSource(fileUrl);
        } else {
          const isUrl: boolean = isHttpUrl(value.toString());

          if (isUrl) setImageSource(value as string);
        }
      } catch (error) {}
    } else setImageSource(null);
  }, [value]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target?.files?.[0];

      if (file) onChange(file);
    } catch (error) {}
  };

  const isError = useMemo(() => (error ? true : false), [error]);

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Label */}
      {label && <span className="mb-1">{label}</span>}

      {/* Upload Button */}
      {!imageSource ? (
        <label className="h-9 w-full border border-primary100 rounded-full bg-white center text-sm text-primary100 shadow">
          {placeholder || "Upload Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      ) : (
        // Image Preview
        <div className="relative w-[68px] h-auto">
          <img
            src={imageSource}
            alt="Uploaded Preview"
            className="w-[68px] h-[68px] object-cover rounded-lg border"
          />

          <button
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 bg-white rounded-full"
          >
            <IoCloseCircleOutline size={24} className="text-red" />
          </button>
        </div>
      )}

      {isError && <span className="text-red">{error}</span>}
    </div>
  );
};

export default UploadImage;
