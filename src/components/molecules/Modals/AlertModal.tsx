import { AlertModalProps } from "../../../common";
import { Button, Separator } from "../../atoms";
import ModalContainer from "./ModalContainer";

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  image,
  title,
  description,
  onDismiss,
}) => {
  const isShowImage = image ? true : false;
  const isShowTitle = title ? true : false;
  const isShowDescription = description ? true : false;

  return (
    <ModalContainer visible={visible} onDismiss={onDismiss}>
      <div>
        {isShowImage && (
          <>
            <div className="center">
              <img src={image} alt="image" className="w-auto h-auto" />
            </div>

            <Separator className="my-3" />
          </>
        )}

        {isShowTitle && (
          <h4 className="text-base font-semibold mb-1.5 text-center">
            {title}
          </h4>
        )}

        {isShowDescription && <p className="text-center mb-3">{description}</p>}

        <Button label="Tutup" onClick={onDismiss} />
      </div>
    </ModalContainer>
  );
};

export default AlertModal;
