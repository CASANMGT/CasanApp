import { useEffect, useState } from "react";
import { IcRightGreen } from "../../../assets";
import { AlertModalProps } from "../../../common";
import { formatPhoneNumber } from "../../../helpers";
import { Button, InputCode, Separator } from "../../atoms";
import ModalContainer from "./ModalContainer";

const InputOTPModal: React.FC<AlertModalProps> = ({
  visible,
  onDismiss,
  onClick,
}) => {
  const phone: string = "081208120812";

  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const [labelTime, setLabelTime] = useState<string>("Kirim Ulang dalam 01:00");
  const [labelError] = useState<string>("Kode verifikasi tidak valid");
  const [counter, setCounter] = useState<number>(60);

  useEffect(() => {
    if (counter > 0) {
      const interval: number = setInterval(() => {
        onCounter();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [counter]);

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

    const isValid: boolean = value.every((item) => item !== "");

    if (isValid) onNext();
  };

  const onRequestCode = () => {
    if (counter === 0) {
      setCounter(60);
      setLabelTime("Kirim Ulang dalam 01:00");
    }
  };

  const onNext = () => {
    alert("coming soon");
  };

  return (
    <ModalContainer visible={visible} onDismiss={onDismiss}>
      <>
        <p className="mb-1.5 text-center">
          Lanjutkan dengan kode OTP untuk masuk
        </p>

        <p className="text-center text-base font-semibold mb-3">
          {formatPhoneNumber(phone)}
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
