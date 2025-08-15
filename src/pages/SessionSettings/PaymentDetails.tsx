import React, { useCallback } from "react";
import { IcInfoCircleGreen } from "../../assets";
import { Voucher } from "../../common";
import { BetweenText } from "../../components";
import { rupiah } from "../../helpers";

interface Item {
  name: string;
  isDiscount?: boolean;
  value: number | string;
}

interface Props {
  chargingNominal: number;
  fee: number;
  milestone?: Milestone;
  voucher?: Voucher | undefined;
}

const PaymentDetails: React.FC<Props> = ({
  chargingNominal,
  fee,
  milestone,
  voucher,
}) => {
  const formattedData = useCallback(() => {
    const newData: Item[] = [];

    newData.push({
      name: "Nominal Pengecasan",
      value: chargingNominal,
    });

    newData.push({
      name: "Biaya Layanan",
      value: fee,
    });

    if (milestone && milestone?.DiscountPercent) {
      const discountMilestone: number =
        (chargingNominal * (milestone?.DiscountPercent || 0)) / 100;

      newData.push({
        name: `Diskon ${milestone?.Name} ${milestone?.DiscountPercent}%`,
        isDiscount: true,
        value: discountMilestone,
      });
    }

    if (voucher && voucher?.VoucherType === 1) {
      const discountVoucher: number =
        voucher?.DiscountType === 1
          ? voucher?.DiscountValue
          : (chargingNominal * voucher?.DiscountValue) / 100;

      if (discountVoucher > 0) {
        newData.push({
          name: "Diskon Voucher",
          isDiscount: true,
          value: discountVoucher,
        });
      }
    }

    return newData;
  }, [chargingNominal, fee, milestone, voucher]);

  const data = formattedData();

  return (
    <div className="bg-white p-3 rounded-lg my-3 drop-shadow">
      <div className="row gap-3 mb-2">
        <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
          <IcInfoCircleGreen />
        </div>

        <p className="text-blackBold font-medium">Rincian Pembayaran</p>
      </div>

      {data.map((item, index) => {
        const isLast: boolean = index === data.length - 1;
        let style = "bg-baseLightGray p-3";

        if (index === 0) style = "bg-baseLightGray p-3 rounded-t";
        else if ((index + 1) % 2 === 0) style = "bg-white p-3";

        if (isLast) style += " rounded-b";

        return (
          <BetweenText
            type="medium-content"
            labelLeft={item.name}
            labelRight={`${
              item?.isDiscount && Number(item?.value || 0) > 0 ? "-" : ""
            }Rp${rupiah(item.value)}`}
            className={style}
          />
        );
      })}
    </div>
  );
};

export default PaymentDetails;
