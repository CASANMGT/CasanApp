import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  fetchLogin,
  fetchSendOTP,
  hideLoading,
  LoginRequest,
  resetDataLogin,
  showLoading,
} from "../../../features";
import { formatPhoneNumber } from "../../../helpers";
import { AppDispatch, RootState } from "../../../store";
import { InputCode, Separator } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface InputOTPProps {
  open: boolean;
  phoneNumber: string;
  onDismiss: () => void;
}

const InputOTPModal: React.FC<InputOTPProps> = ({
  open,
  phoneNumber,
  onDismiss,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { login } = useAuth();

  const dataLogin = useSelector((state: RootState) => state.login);

  const [codes, setCodes] = useState<string[]>(["", "", "", "", "", ""]);
  const [labelTime, setLabelTime] = useState<string>("Kirim Ulang dalam 01:00");
  const [labelError, setLabelError] = useState<string>();
  const [counter, setCounter] = useState<number>(60);

  useEffect(() => {
    if (counter > 0) {
      const interval: number = setInterval(() => {
        onCounter();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [counter]);

  useEffect(() => {
    if (dataLogin?.loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (dataLogin?.data) {
      dispatch(resetDataLogin());
      login();
      navigate("/session-settings");
      onDismiss();
    } else if (dataLogin?.error) {
      dispatch(resetDataLogin());
      setLabelError("kode verifikasi tidak valid");
    }
  }, [dataLogin]);

  const getOTP = () => {
    dispatch(fetchSendOTP(phoneNumber.replace(/\s+/g, "")));
  };

  const onCounter = () => {
    const remaining: number = counter - 1;
    const m: number = Math.floor(remaining / 60);
    const s: number = remaining % 60;

    const minutes = m < 10 ? "0" + m : m;
    const seconds = s < 10 ? "0" + s : s;

    setCounter(remaining);
    if (remaining) setLabelTime(`Kirim Ulang dalam  ${minutes}:${seconds}`);
    else setLabelTime(`Kirim Ulang`);
  };

  const onChangeText = (value: string[]) => {
    setCodes(value);
    setLabelError("");

    const isValid: boolean = value.every((item) => item !== "");

    if (isValid) onNext(value);
  };

  const onRequestCode = () => {
    getOTP();
    if (counter === 0) {
      setCounter(60);
      setLabelTime("Kirim Ulang dalam 01:00");
    }
  };

  const onNext = (code: string[]) => {
    const body: LoginRequest = {
      code: code.join(""),
      phone_number: formatPhone.replace(/\s+/g, ""),
    };

    dispatch(fetchLogin(body));
  };

  const formatPhone: string = formatPhoneNumber(phoneNumber);

  return (
    <ModalContainer isOpen={open} onDismiss={onDismiss}>
      <>
        <p className="mb-1.5 text-center">
          Lanjutkan dengan kode OTP untuk masuk
        </p>

        <p className="text-center text-base font-semibold mb-3">
          {formatPhone}
        </p>

        <InputCode values={codes} error={labelError} onChange={onChangeText} />

        <Separator className="my-4" />

        <div className="center">
          <span className="opacity-80 text-xs">
            Tidak mendapatkan kode?{" "}
            <a
              className={
                counter === 0 ? "text-primary100 font-bold cursor-pointer" : ""
              }
              onClick={onRequestCode}
            >
              {labelTime}
            </a>
          </span>
        </div>
      </>
    </ModalContainer>
  );
};

export default InputOTPModal;
