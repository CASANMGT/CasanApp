import { IoSearchOutline } from "react-icons/io5";

interface Props {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
}

const InputSearch: React.FC<Props> = ({ placeholder, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: string = e?.target?.value;

    onChange(value);
  };
  return (
    <div className="h-10 rounded-full bg-baseLightGray/70 row flex-1">
      <IoSearchOutline size={20} className="ml-3" />

      <input
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="h-full w-full px-2.5 py-3 bg-transparent text-sm text-black100 focus:outline-none  "
      />
    </div>
  );
};

export default InputSearch;
