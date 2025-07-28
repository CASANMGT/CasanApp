import React from "react";
import { IcRadioActive, IcRadioInactive, ILNoImage } from "../../../assets";
import { OptionsProps } from "../../../common";
import { formatDiff } from "../../../helpers";

interface Props {
  data: OptionsProps;
  isActive: boolean;
  onSelectSK: () => void;
  onSelect: () => void;
}

const VoucherCard: React.FC<Props> = ({
  data,
  isActive,
  onSelectSK,
  onSelect,
}) => {
  const isError = data?.error ? true : false;
  const isDiscount = data?.data?.VoucherType === 1 ? true : false;
  let duration = "";
  let isShowDuration = false;

  if (!data?.data?.NoEndPeriod) {
    isShowDuration = true;
    duration = formatDiff(data?.data?.EndDate);
  }

  return (
    <div className="mb-4">
      <div
        onClick={() => !isError && onSelect()}
        className={`relative flex ${
          isError ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <img
          src={data?.data?.VoucherThumbnailURL || ILNoImage}
          alt="voucher"
          className="w-[100px] h-[100px] object-center border-l-2 border-l-primary100 border-dashed"
        />

        <div
          className={`row gap-4 flex-1 py-2 pl-4 pr-2 border-t border-r border-black10  max-h-[100px] ${
            isError ? "rounded-tr-lg" : "border-b rounded-r-lg"
          }`}
        >
          <div className="flex-1 space-y-1">
            <p className="text-blackBold font-medium">
              {data?.data?.VoucherName}
            </p>
            <p className="text-xs ">{data?.data?.Description}</p>
            {/* <div className="flex baseline">
              <div className="border border-primary100 px-1.5 py-0.5 text-primary100 text-[10px]">
                Voucher Referral
              </div>
            </div> */}
            <p className="text-[10px] font-medium text-black90">
              {`${isShowDuration ? `${duration} ` : ""}`}
              <button
                type="button"
                onClick={onSelectSK}
                className="text-primary100 text-[10px]"
              >
                S&K
              </button>
            </p>
          </div>

          {isActive ? <IcRadioActive /> : <IcRadioInactive />}
        </div>

        {isError && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black10/50" />
        )}
      </div>

      {isError && (
        <div className="p-2 rounded-b-lg border border-black10">
          <span className="text-xs">{data?.error}</span>
        </div>
      )}
    </div>
  );
};

export default VoucherCard;
