import { formatPhoneNumber } from "../../../helpers";
import { Button } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface RequestOTPProps {
  open: boolean;
  phoneNumber: string;
  onDismiss: () => void;
  onClick: () => void;
}

const RequestOTPModal: React.FC<RequestOTPProps> = ({
  open,
  phoneNumber,
  onDismiss,
  onClick,
}) => {
  return (
    <ModalContainer isOpen={open} onDismiss={onDismiss}>
      <>
        <p className="mb-1.5 text-center">
          Lanjutkan dengan kode OTP untuk masuk
        </p>

        <p className="text-center text-base font-semibold">
          {formatPhoneNumber(phoneNumber)}
        </p>

        <Button
          label="Request OTP untuk Masuk"
          onClick={onClick}
          className="my-3"
        />

        <div className="text-xs">
          <p>
            Dengan mendaftar, Anda menyetujui{" "}
            <b className="text-primary100 cursor-pointer">Syarat & Ketentuan</b>{" "}
            dan{" "}
            <b className="text-primary100 cursor-pointer">Kebijakan Privasi</b>{" "}
            kami.
          </p>
        </div>

        {/* <Separator className="my-3" />

        <Button
          type="secondary"
          label="Lanjut Sebagai Tamu"
          iconRight={IcRightGreen}
          onClick={onDismiss}
          className="my-3"
        /> */}
      </>
    </ModalContainer>
  );
};

export default RequestOTPModal;
