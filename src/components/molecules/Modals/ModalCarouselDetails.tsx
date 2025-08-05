import React from "react";
import { IcClose } from "../../../assets";
import ModalContainer from "./ModalContainer";
import { Slides } from "../Carousel";

interface Props {
  visible: boolean;
  data: Slides;
  onDismiss: () => void;
}

const ModalCarouselDetails: React.FC<Props> = ({
  visible,
  data,
  onDismiss,
}) => {
  return (
    <ModalContainer
      isOpen={visible}
      isBottom
      onDismiss={onDismiss}
      classNameBottom="h-auto"
    >
      <div className="w-full bg-white rounded-t-xl between-y">
        <div className="flex-1 flex flex-col px-4 pt-4 overflow-hidden relative">
          <div className="between-x mb-6">
            <label className="text-base font-semibold">Detail</label>

            <div onClick={onDismiss} className="cursor-pointer">
              <IcClose className="text-black100" />
            </div>
          </div>

          <div className="overflow-auto scrollbar-none text-black100 mb-6">
            <h2 className="font-semibold mb-2">Masa Berlaku</h2>
            <p>{data?.details?.validityPeriod}</p>

            <h2 className="font-semibold mb-2 mt-6">Syarat</h2>
            <ul className="list-disc pl-5 space-y-1 text-black100 text-sm">
              {data?.details?.termsCondition.map((e) => (
                <li>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalCarouselDetails;
