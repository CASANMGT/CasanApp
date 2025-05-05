import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IcClose, IcRadioActive, IcRadioInactive } from "../../../assets";
import { CUSTOMER_SERVICES, MAX_INPUT_PIN } from "../../../common";
import { fetchCheckPin, resetDataCheckPin } from "../../../features";
import { moments, openWhatsApp } from "../../../helpers";
import { AppDispatch, RootState } from "../../../store";
import { Button, InputCode, Separator } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
}

const ModalInputPin: React.FC<Props> = ({ isOpen, onDismiss }) => {
  const dispatch = useDispatch<AppDispatch>();

  const checkPin = useSelector((state: RootState) => state.checkPin);
  const myUser = useSelector((state: RootState) => state.myUser);

  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const [countError, setCountError] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      formatError(myUser?.data?.WithdrawPINCooldownUntil);
    }
  }, [isOpen]);

  useEffect(() => {
    if (checkPin?.data) {
      if (!checkPin?.data?.data?.is_match) {
        if (
          checkPin?.data?.data?.user?.WithdrawPINFailedAttempts %
            MAX_INPUT_PIN ===
          0
        ) {
          formatError(checkPin?.data?.data?.user?.WithdrawPINCooldownUntil);
        } else {
          const count = countError + 1;
          setErrorMessage(
            `PIN salah. Coba lagi. (${
              checkPin?.data?.data?.user?.WithdrawPINFailedAttempts %
              MAX_INPUT_PIN
            }/${MAX_INPUT_PIN})`
          );

          setCountError(count);
        }
      }

      dispatch(resetDataCheckPin());
    } else if (checkPin?.error?.response?.data) {
      const error: string = checkPin?.error?.response?.data?.error;
      const split = error.split("until ")[1];

      if (split) formatError(moments(split).format("YY-MM-DD HH:mm"));

      dispatch(resetDataCheckPin());
    }
  }, [checkPin]);

  const formatError = (date?: string) => {
    if (date) {
      const diff = moments(date).diff(moments(), "minutes");
      const hours = Math.floor(diff / 60);

      if (diff > 0) {
        setIsDisabled(true);

        let label = "";

        if (hours > 0) label = `${hours} jam`;
        else label = `${diff} menit`;

        setErrorMessage(
          `Anda telah memasukkan konfirmasi PIN yang salah beberapa kali. Silakan tunggu ${label} sebelum mencoba lagi`
        );
      }
    }
  };

  const validation = () => {
    let value: boolean = true;

    if (!isDisabled) {
      const some = codes.some((e) => e === "");
      if (!some) value = false;
    }

    return value;
  };

  const onConfirmation = () => {
    dispatch(fetchCheckPin(codes.join("")));
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      isBottom
      onDismiss={onDismiss}
      classNameBottom="!h-auto"
    >
      <div className="w-full bg-white p-4 rounded-t-xl">
        <div className="between-x mb-4">
          <label className="text-base font-semibold">Masukkan PIN</label>

          <div onClick={onDismiss} className="cursor-pointer">
            <IcClose className="text-black100" />
          </div>
        </div>

        <div className="w-full mt-6 bg-white px-10 py-9 drop-shadow rounded-lg">
          <p className="text-center mb-4">Silahkan masukkan kode PIN anda</p>

          <InputCode
            type="password"
            values={codes}
            error={errorMessage}
            onChange={(value: string[]) => {
              if (errorMessage) setErrorMessage("");
              setCodes(value);
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

        <div className="py-6 px-4 border-t border-t-black10 mt-4 -mx-4">
          <Button
            label="Konfirmasi PIN"
            buttonType="lg"
            disabled={validation()}
            onClick={onConfirmation}
          />
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalInputPin;

interface SelectBankCardProps {
  isActive: boolean;
  onSelect: () => void;
}

export const SelectBankCard: React.FC<SelectBankCardProps> = ({
  isActive,
  onSelect,
}) => {
  return (
    <div onClick={onSelect} className="cursor-pointer">
      <div className="between-x py-4">
        <div className="flex-col flex">
          <span className="text-blackBold text-xs font-medium">
            Bank Mandiri - 1440024861665
          </span>
          <span className="text-xs mt-1">TEDY IMAN PRIYO TANTO</span>
        </div>

        {isActive ? <IcRadioActive /> : <IcRadioInactive />}
      </div>

      <Separator />
    </div>
  );
};
