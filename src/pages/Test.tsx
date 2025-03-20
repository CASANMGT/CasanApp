import { useState } from "react";
import { Input } from "../components";

const Test = () => {
  const [value, setValue] = useState("");
  return (
    <div>
      <Input
      type='number'
        value={value}
        placeholder="Masukan..."
        onChange={(e) => setValue(e)}
      />
    </div>
  );
};

export default Test;
