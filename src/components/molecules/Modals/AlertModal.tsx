import { Button, Separator } from "../../atoms";
import ModalContainer from "./ModalContainer";

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  image,
  icon,
  title,
  loading,
  typeButtonLeft,
  labelButtonLeft,
  labelButtonRight,
  typeButtonRight,
  description,
  onDismiss,
  onClick,
}) => {
  const Icon = icon;
  const isShowIcon = icon ? true : false;
  const isShowImage = image ? true : false;
  const isShowTitle = title ? true : false;
  const isShowDescription = description ? true : false;
  const isShowClick = onClick ? true : false;

  return (
    <ModalContainer
      isOpen={visible}
      onDismiss={onDismiss && !loading ? onDismiss : () => {}}
    >
      <div>
        {isShowIcon && (
          <div className="mb-5 mt-3 center">
            <Icon size={36} className="text-green"/>
          </div>
        )}

        {isShowImage && (
          <>
            <div className="center">
              <img src={image} alt="image" className="w-auto h-auto" />
            </div>

            <Separator className="my-3" />
          </>
        )}

        {isShowTitle && (
          <h4 className="text-base font-semibold mb-1 text-center">{title}</h4>
        )}

        {isShowDescription && (
          <p className="text-center text-black70 mb-6">{description}</p>
        )}

        <div className="between-x gap-2">
          {isShowClick && (
            <Button
              type={typeButtonLeft}
              label={labelButtonLeft || ""}
              loading={loading}
              onClick={() => {
                if (onClick) onClick();
              }}
            />
          )}
          {onDismiss && (
            <Button
              type={typeButtonRight || "secondary"}
              label={labelButtonRight || ""}
              loading={loading}
              onClick={onDismiss}
            />
          )}
        </div>
      </div>
    </ModalContainer>
  );
};

export default AlertModal;
