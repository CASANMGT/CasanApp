import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Button, Header, InputCode } from "../components";

const InputPin = () => {
  const navigate: NavigateFunction = useNavigate();

  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);

  const onDismiss = () => {
    navigate(-1);
  };

  const onChangeText = (value: string[]) => {
    setCodes(value);
  };

  const onNext = () => {
    alert("coming soon");
  };

  return (
    <div className="background-1 flex flex-col">
      <Header
        className="mx-4 mt-3.5"
        type={"secondary"}
        title="Masuakn Pin"
        onDismiss={onDismiss}
      />

      <div className="flex flex-col h-full justify-between">
        <div className="flex">
          <div className="w-full mx-4 mt-[72px] bg-white py-9 drop-shadow rounded-lg">
            <p className="text-center mb-4">Silahkan masukkan kode PIN anda</p>

            <InputCode type="password" values={codes} onChange={onChangeText} />
          </div>
        </div>

        <div className="bg-white rounded-t-2xl px-4 py-6">
          <Button buttonType="lg" label="Konfirmasi PIN" onClick={onNext} />
        </div>
      </div>
    </div>
  );
};

export default InputPin;
