import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { IcClose } from "../../../assets";
import { ERROR_MESSAGE } from "../../../common";
import { hideLoading, showLoading } from "../../../features";
import { formatPhoneNumber } from "../../../helpers";
import { Api } from "../../../services";
import { AppDispatch } from "../../../store";
import { InputCode, Separator } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface Props {
  isOpen: boolean;
  data: UserProps | null;
  onDismiss: () => void;
  onConfirm: () => void;
}

const ModalResetPin: React.FC<Props> = ({
  isOpen,
  data,
  onDismiss,
  onConfirm,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [condition, setCondition] = useState<"send-otp" | "input-otp">(
    "send-otp"
  );
  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const [labelTime, setLabelTime] = useState<string>("Kirim Ulang dalam 01:00");
  const [labelError, setLabelError] = useState<string>();
  const [counter, setCounter] = useState<number>(0);

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

  const getOTP = async () => {
    try {
      await Api.post({
        url: "send-otp",
        body: { phone_number: data?.Phone, channel: 2 },
      });
    } catch (error) {}
  };

  const onSendOTP = () => {
    setCondition("input-otp");

    if (condition === "send-otp") {
      setCondition("input-otp");
      setCounter(60);
      getOTP();
    }
  };

  const onRequestCode = () => {
    getOTP();

    if (counter === 0) {
      setCounter(60);
      setLabelTime("Kirim Ulang dalam 01:00");
    }
  };

  const onChangeText = (value: string[]) => {
    if (labelError) setLabelError("");

    setCodes(value);
    setLabelError("");

    const isValid: boolean = value.every((item) => item !== "");

    if (isValid) onNext(value);
  };

  const onNext = async (code: string[]) => {
    try {
      if (condition === "input-otp") {
        dispatch(showLoading());
        await Api.put({
          url: `users/pin/reset/${code.join("")}`,
        });

        dispatch(hideLoading());
        onConfirm();
      } else {
        throw new Error(ERROR_MESSAGE);
      }
    } catch (error) {
      alert(ERROR_MESSAGE);
    }
  };

  let phone: string = "";

  if (data?.Phone) {
    const length = data?.Phone.length;
    phone = data?.Phone.slice(length - 3, length);
  }

  return (
    <ModalContainer
      isOpen={isOpen}
      isBottom
      onDismiss={onDismiss}
      classNameBottom="!h-auto"
    >
      <div className="w-full bg-white p-4 rounded-t-xl">
        {/* HEADER */}
        <div className="between-x mb-4">
          <label className="text-base font-semibold">Reset PIN</label>

          <div onClick={onDismiss} className="cursor-pointer">
            <IcClose className="text-black100" />
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-col item-center mt-6 bg-white px-10 py-9 drop-shadow rounded-lg">
          <span className="text-center">
            {condition === "send-otp"
              ? "Silakan konfirmasi OTP untuk alasan keamanan"
              : condition === "input-otp"
              ? "Silakan masukkan kode yang dikirimkan ke WA"
              : ""}
          </span>

          {condition === "input-otp" && (
            <p className="text-center text-base font-semibold ">
              {formatPhoneNumber(data?.Phone || "")}
            </p>
          )}

          {condition === "send-otp" && (
            <div
              onClick={onSendOTP}
              className="mt-4 rounded-xl border border-black10 flex flex-col p-4 items-center justify-center cursor-pointer"
            >
              <div className="row gap-1">
                <span className="text-base font-semibold">
                  Kirim OTP Lewat WA
                </span>
                <FaWhatsapp />
              </div>

              <p className="">
                Kode akan dikirim lewat WA{" "}
                <span className="font-bold">***{phone}</span>
              </p>
            </div>
          )}

          {condition === "input-otp" && (
            <div className="mt-3">
              <InputCode
                values={codes}
                error={labelError}
                onChange={onChangeText}
              />

              {condition === "input-otp" && (
                <>
                  <Separator className="my-4" />

                  <div className="center">
                    <span className="opacity-80 text-xs">
                      Tidak mendapatkan kode?{" "}
                      <a
                        className={
                          counter === 0
                            ? "text-xs text-primary100 font-bold cursor-pointer"
                            : "text-xs"
                        }
                        onClick={onRequestCode}
                      >
                        {labelTime}
                      </a>
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalResetPin;
