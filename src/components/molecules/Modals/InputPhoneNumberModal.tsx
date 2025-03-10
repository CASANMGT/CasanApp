import { useState } from "react";
import { AlertModalProps, REGEX_PHONE_NUMBER_HALF } from "../../../common";
import { Button, Input } from "../../atoms";
import ModalContainer from "./ModalContainer";

const InputPhoneNumberModal: React.FC<AlertModalProps> = ({
  visible,
  onDismiss,
  onClick,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleChange = (value: string) => {
    setPhoneNumber(value);
  };

  const onValidation = () => {
    let value: boolean = !REGEX_PHONE_NUMBER_HALF.test(phoneNumber);

    return value;
  };

  return (
    <ModalContainer isOpen={visible} onDismiss={onDismiss}>
      <>
        <p className="mb-3 text-base font-semibold text-center">
          Masukan Nomor Telepon
        </p>

        <Input
          type={"phone"}
          value={phoneNumber}
          autoFocus
          placeholder="No Handphone"
          onChange={handleChange}
        />

        <Button
          className="my-3"
          label="Lanjutkan"
          disabled={onValidation()}
          onClick={onClick}
        />

        <div className="text-xs">
          <p>
            Dengan mendaftar, Anda menyetujui{" "}
            <b className="text-primary100 cursor-pointer">Syarat & Ketentuan</b>{" "}
            dan <b className="text-primary100 cursor-pointer">Kebijakan Privasi</b>{" "}
            kami.
          </p>
        </div>
      </>
    </ModalContainer>
  );
};

export default InputPhoneNumberModal;
