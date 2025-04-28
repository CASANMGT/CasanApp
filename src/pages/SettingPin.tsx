import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IcSuccessGreen } from "../assets";
import { CUSTOMER_SERVICES } from "../common";
import { AlertModal, Button, Header, InputCode } from "../components";
import { fetchCheckPin, resetDataCheckPin } from "../features";
import { openWhatsApp } from "../helpers";
import { AppDispatch, RootState } from "../store";

const maxError: number = 3;

const SettingPin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const myUser = useSelector((state: RootState) => state.myUser);
  const checkPin = useSelector((state: RootState) => state.checkPin);

  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const [changeCodes, setChangeCodes] = useState<string[]>(["", "", "", ""]);
  const [isNewPin, setIsNewPin] = useState<boolean>(true);
  const [isChangePin, setIsChangePin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  useEffect(() => {
    if (!myUser?.data) navigate(-1);
    else if (myUser?.data?.WithdrawPIN) setIsNewPin(false);
  }, []);

  useEffect(() => {
    if (checkPin?.data) {
      if (checkPin?.data?.data?.is_match) setIsChangePin(true);
      else setErrorMessage(checkPin?.data?.message || "");

      dispatch(resetDataCheckPin());
    }
  }, [checkPin]);

  const validation = () => {
    let value: boolean = true;

    if (isChangePin) {
      const some = changeCodes.some((e) => e === "");
      if (!some) value = false;
    } else {
      const some = codes.some((e) => e === "");
      if (!some) value = false;
    }

    return value;
  };

  const onDismiss = () => {
    if (isChangePin) {
      setIsChangePin(false);
      setChangeCodes(["", "", "", ""]);
    } else navigate(-1);
  };

  const onNext = () => {
    if (isNewPin || isChangePin)
      navigate("/confirmation-pin", { state: codes });
    else {
      dispatch(fetchCheckPin(codes.join("")));
    }
  };

  return (
    <div className="background-1 flex flex-col">
      <Header
        className="mx-4 mt-3.5"
        type={"secondary"}
        title={
          isNewPin
            ? "Pengaturan Pin"
            : isChangePin
            ? "Ubah PIN"
            : "Masukkan Pin"
        }
        onDismiss={onDismiss}
      />

      <div className="flex flex-col h-full justify-between">
        <div className="flex">
          <div className="w-full mx-4 mt-[72px] bg-white py-9 drop-shadow rounded-lg">
            <p className="text-center mb-4">
              {isNewPin
                ? "Silahkan masukkan kode PIN anda"
                : isChangePin
                ? "Silahkan masukkan kode PIN Anda yang baru"
                : "Silahkan masukkan kode PIN lama Anda"}
            </p>

            <InputCode
              type="password"
              values={isChangePin ? changeCodes : codes}
              error={errorMessage}
              onChange={(value: string[]) => {
                if (errorMessage) setErrorMessage("");
                if (isChangePin) setChangeCodes(value);
                else setCodes(value);
              }}
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
          <Button
            buttonType="lg"
            label="Konfirmasi PIN"
            disabled={validation()}
            loading={checkPin?.loading}
            onClick={onNext}
          />
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
        onClick={() => setOpenUpdate(false)}
      />
      {/* END MODAL */}
    </div>
  );
};

export default SettingPin;
