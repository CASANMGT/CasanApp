import { useNavigate } from "react-router-dom";
import { REGEX_PHONE_NUMBER_HALF } from "../../../common";
import { Button, Input } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface InputPhoneNumberModalProps {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onDismiss: () => void;
  onClick: () => void;
}

const InputPhoneNumberModal: React.FC<InputPhoneNumberModalProps> = ({
  open,
  value,
  onDismiss,
  onClick,
  onChange,
}) => {
  const navigate = useNavigate();

  const onValidation = () => {
    let check: boolean = !REGEX_PHONE_NUMBER_HALF.test(value);

    return check;
  };

  return (
    <ModalContainer isOpen={open} onDismiss={onDismiss}>
      <>
        <p className="mb-3 text-base font-semibold text-center">
          Masukan Nomor Telepon
        </p>

        <Input
          type={"phone"}
          value={value}
          autoFocus
          placeholder="No Handphone"
          onChange={onChange}
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
            <b
              onClick={() => navigate("/text-condition")}
              className="text-primary100 cursor-pointer"
            >
              Syarat & Ketentuan
            </b>{" "}
            dan{" "}
            <b
              onClick={() => navigate("/privacy-police")}
              className="text-primary100 cursor-pointer"
            >
              Kebijakan Privasi
            </b>{" "}
            kami.
          </p>
        </div>
      </>
    </ModalContainer>
  );
};

export default InputPhoneNumberModal;
