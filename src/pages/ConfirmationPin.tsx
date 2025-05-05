import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { IcSuccessGreen } from "../assets";
import { CUSTOMER_SERVICES } from "../common";
import { AlertModal, Button, Header, InputCode } from "../components";
import {
  fetchEditPin,
  hideLoading,
  resetDataEditPin,
  showLoading,
} from "../features";
import { openWhatsApp } from "../helpers";
import { AppDispatch, RootState } from "../store";

const ConfirmationPin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const myUser = useSelector((state: RootState) => state.myUser);
  const editPin = useSelector((state: RootState) => state.editPin);

  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const [isNewPin, setIsNewPin] = useState<boolean>(true);
  const [countError, setCountError] = useState<number>(0);
  const [maxCountError, setMaxCountError] = useState<number>(3);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  useEffect(() => {
    if (!myUser?.data) navigate(-1);
    else if (myUser?.data?.WithdrawPIN) {
      setIsNewPin(false);
    }
  }, []);

  useEffect(() => {
    if (countError === maxCountError) {
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    }
  }, [countError]);

  useEffect(() => {
    if (editPin?.loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (editPin?.data) {
      dispatch(resetDataEditPin());
      setOpenSuccess(true);
    }
  }, [editPin]);

  const validation = () => {
    let value: boolean = true;

    const some = codes.some((e) => e === "");
    if (!some) value = false;

    return value;
  };

  const onNext = () => {
    const beforeCode: string = location?.state.join("");
    const codeJoin: string = codes.join("");

    if (codeJoin === beforeCode) dispatch(fetchEditPin(codeJoin));
    else if (countError < maxCountError) setCountError((prev) => prev + 1);
  };

  return (
    <div className="background-1 flex flex-col">
      <Header
        className="mx-4 mt-3.5"
        type={"secondary"}
        title={`Konfirmasi Pin${!isNewPin ? ` Baru` : ""}`}
        onDismiss={() => navigate(-1)}
      />

      <div className="flex flex-col h-full justify-between">
        <div className="flex">
          <div className="w-full mx-4 mt-[72px] bg-white py-9 drop-shadow rounded-lg">
            <p className="text-center mb-4">
              {`Silahkan masukkan ulang kode PIN anda${
                !isNewPin && ` yang baru`
              }`}
            </p>

            <InputCode
              type="password"
              values={codes}
              error={
                countError > 0
                  ? `PIN${
                      !isNewPin ? ` baru` : ""
                    } salah. Coba lagi. (${countError}/${maxCountError})`
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
          <Button
            buttonType="lg"
            label="Konfirmasi PIN"
            disabled={validation()}
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
        onClick={() => {
          setOpenSuccess(false);
          navigate(-2);
        }}
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

export default ConfirmationPin;
