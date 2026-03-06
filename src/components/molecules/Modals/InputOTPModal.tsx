import { useEffect, useState } from "react";
import { CiMail } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLogin,
  hideLoading,
  LoginRequest,
  resetDataLogin,
  showLoading,
} from "../../../features";
import { formatPhoneNumber } from "../../../helpers";
import { Api } from "../../../services";
import { AppDispatch, RootState } from "../../../store";
import { Button, InputCode, Separator } from "../../atoms";
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
  const dispatch = useDispatch<AppDispatch>();

  const dataLogin = useSelector((state: RootState) => state.login);

  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const [labelTime, setLabelTime] = useState<string>("Kirim Ulang dalam 01:00");
  const [labelError, setLabelError] = useState<string>();
  const [counter, setCounter] = useState<number>(60);
  const [formatPhone, setFormatPhone] = useState<string>("");
  const [channel, setChannel] = useState<number>(2);

  useEffect(() => {
    if (open && phoneNumber) {
      const formatted: string = formatPhoneNumber(phoneNumber);
      getOTP(formatted);
      setFormatPhone(formatted);
    }
  }, [open]);

  useEffect(() => {
    if (counter > 0) {
      const interval = setInterval(() => {
        onCounter();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [counter]);

  useEffect(() => {
    if (dataLogin?.loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (dataLogin?.error) {
      dispatch(resetDataLogin());
      setLabelError("kode verifikasi tidak valid");
    }
  }, [dataLogin]);

  const getOTP = async (phone: string) => {
    await Api.post({
      url: "send-otp",
      body: { phone_number: phone.replace(/\s+/g, ""), channel },
    });

    // setChannel((prev) => (prev === 1 ? 2 : 1));
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
    getOTP(formatPhone);
    if (counter === 0) {
      setCounter(60);
      setLabelTime("Kirim Ulang dalam 01:00");
    }
  };

  const onNext = (code: string[]) => {
    const body: LoginRequest = {
      code: code.join(""),
      phone_number: formatPhone.replace(/\s+/g, ""),
      channel,
    };

    dispatch(fetchLogin(body));
  };

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

        <Button
          type="secondary"
          label={`Kirim OTP lewat ${channel === 2 ? "WA" : "SMS"}`}
          disabled={counter !== 0}
          onClick={onRequestCode}
          iconRight={channel === 2 ? FaWhatsapp : CiMail}
          className="mt-4"
        />
      </>
    </ModalContainer>
  );
};

export default InputOTPModal;
