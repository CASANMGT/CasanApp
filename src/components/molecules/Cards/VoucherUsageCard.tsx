import React from "react";
import { ILNoImage } from "../../../assets";
import { VoucherUsage } from "../../../common";
import { formatDiff } from "../../../helpers";

interface Props {
  type?: "secondary";
  data: VoucherUsage | undefined;
  onSelect?: () => void;
  onSelectSK?: () => void;
}

const VoucherUsageCard: React.FC<Props> = ({
  type,
  data,
  onSelect,
  onSelectSK,
}) => {
  const status = getLabelStatus(data?.Status);
  const duration = getLabelDuration(data);

  return (
    <div
      onClick={() => onSelect && onSelect()}
      className={`relative flex-1 flex mb-4 ${onSelect && "cursor-pointer"}`}
    >
      <img
        src={data?.VoucherDetails?.VoucherThumbnailURL || ILNoImage}
        alt="voucher"
        className="w-[100px] h-[100px] border-l-2 border-l-primary100 border-dashed"
      />

      <div className="flex flex-col gap-1 flex-1 py-2 pl-4 pr-2 border-y border-r rounded-r-lg border-black10  max-h-[100px]">
        <p className="text-blackBold font-medium">
          {data?.VoucherDetails?.VoucherName || "-"}
        </p>
        <p className="text-xs ">
          {data?.VoucherDetails?.Description || "-"}{" "}
          {type === "secondary" && (
            <button
              type="button"
              onClick={onSelectSK}
              className="text-primary100 text-[10px]"
            >
              S&K
            </button>
          )}
        </p>

        <div className="flex baseline">
          <div className="border border-primary100 px-1.5 py-0.5 text-primary100 text-[10px]">
            Disediakan Oleh{" "}
            {data?.VoucherDetails?.ProvidedBy === 1 ? "Casan" : "Partner"}
          </div>
        </div>

        <div className="between-x">
          <p className="text-[10px] font-medium text-black90">
            {type === "secondary" ? `Sesi ID ${data?.SessionID}` : duration}
          </p>

          <p className={`text-xs font-medium text-${status?.color}`}>
            {status?.label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoucherUsageCard;

const getLabelStatus = (status: number | undefined) => {
  let label: string = "";
  let color: string = "black100";

  switch (status) {
    case 1:
      label = "Sudah Diklaim";
      color = "primary100";
      break;

    case 2:
      label = "Belum Diklaim";
      break;

    case 3:
      label = "Expired";
      color = "red";
      break;

    default:
      break;
  }

  return { label, color };
};

const getLabelDuration = (data: VoucherUsage | undefined) => {
  let label = "";

  if (data?.Status === 3) label = "Voucher sudah expired";
  else if (
    !data?.VoucherDetails?.NoEndPeriod &&
    data?.VoucherDetails?.EndDate
  ) {
    label = formatDiff(data?.VoucherDetails?.EndDate);
  }

  return label;
};
