import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IcSuccessGreen } from "../assets";
import { CUSTOMER_SERVICES } from "../common";
import { AlertModal, Button, Header, InputCode } from "../components";
import { openWhatsApp } from "../helpers";

const maxError: number = 3;

const InputPin = () => {
  const navigate: NavigateFunction = useNavigate();

  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const [countError, setCountError] = useState<number>(1);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const onDismiss = () => {
    navigate(-1);
  };

  const onNext = () => {
    setOpenUpdate(true);
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

            <InputCode
              type="password"
              values={codes}
              error={
                countError > 0
                  ? `PIN salah. Coba lagi. (${countError}/${maxError})`
                  : ""
              }
              onChange={(value: string[]) => setCodes(value)}
            />

            <p className="text-xs text-black70 mt-4 text-center">
              Butuh bantuan?{" "}
              <b
                onClick={() => openWhatsApp(CUSTOMER_SERVICES)}
                className="text-xs text-primary100 cursor-pointer"
              >
                Hubungi Kami
              </b>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-t-2xl px-4 py-6">
          <Button buttonType="lg" label="Konfirmasi PIN" onClick={onNext} />
        </div>
      </div>

      {/* MODAL */}
      <AlertModal
        visible={openSuccess}
        icon={IcSuccessGreen}
        title="PIN telah dibuat"
        description="PIN Anda berhasil dibuat"
        labelButtonLeft="Tutup"
        typeButtonLeft="secondary"
        onClick={() => setOpenSuccess(false)}
      />

      <AlertModal
        visible={openUpdate}
        icon={IcSuccessGreen}
        title="PIN berhasil diperbaharui"
        description="PIN Anda berhasil diperbaharui"
        labelButtonLeft="Tutup"
        typeButtonLeft="secondary"
        onClick={() => setOpenSuccess(false)}
      />
      {/* END MODAL */}
    </div>
  );
};

export default InputPin;
