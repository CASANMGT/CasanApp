import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IcClose } from "../../../assets";
import { OptionsProps } from "../../../common";
import { fetchVoucherAvailable, setFromGlobal } from "../../../features";
import { rupiah } from "../../../helpers";
import { AppDispatch, RootState } from "../../../store";
import { Button, LoadingPage } from "../../atoms";
import { VoucherCard } from "../Cards";
import ModalContainer from "./ModalContainer";

interface Props {
  visible: boolean;
  total: number;
  select: OptionsProps | undefined;
  chargingStationID: number;
  userId: number | undefined;
  onDismiss: () => void;
  onSelect: (value: OptionsProps | undefined) => void;
}

const ModalVoucher: React.FC<Props> = ({
  visible,
  select,
  total,
  userId,
  chargingStationID,
  onSelect,
  onDismiss,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const voucherAvailable = useSelector(
    (state: RootState) => state.voucherAvailable
  );
  const [optionVoucherDiscount, setOptionVoucherDiscount] =
    useState<OptionsProps[]>();
  const [optionVoucherProduct, setOptionVoucherProduct] =
    useState<OptionsProps[]>();
  const [selected, setSelected] = useState<OptionsProps>();

  useEffect(() => {
    if (visible) setUp();
  }, [visible]);

  // manage response get voucher list
  useEffect(() => {
    if (
      visible &&
      chargingStationID &&
      voucherAvailable?.data?.data &&
      voucherAvailable?.data?.data.length
    ) {
      const newDataDiscount: OptionsProps[] = [];
      const newDataProduct: OptionsProps[] = [];

      voucherAvailable?.data?.data.map((e) => {
        const format =
          e?.VoucherType === 1
            ? ` • Discount ${
                e?.DiscountType === 1
                  ? `Rp${rupiah(e?.DiscountValue)}`
                  : `${e?.DiscountValue}%`
              }`
            : "";

        let error = "";

        if (e?.ChargingStations.some((i) => i?.ID === chargingStationID || 0)) {
          if (total < e?.MinimumCharging)
            error = `Min. Pembayaran Rp${rupiah(e?.MinimumCharging)}`;
        } else error = "Voucher tidak berlaku di stasiun ini!";

        const newItem: OptionsProps = {
          type: e?.VoucherType === 1 ? "discount" : "product",
          name: `ID${e?.ID} • ${e?.VoucherName}${format}`,
          value: e?.ID,
          error,
          data: e,
        };

        (e?.VoucherType === 1 ? newDataDiscount : newDataProduct).push(newItem);
      });

      setOptionVoucherDiscount(newDataDiscount);
      setOptionVoucherProduct(newDataProduct);
    }
  }, [voucherAvailable?.data, total]);

  const setUp = () => {
    if (userId) dispatch(fetchVoucherAvailable());
    setSelected(select);
  };

  const isShowVoucherDiscount = useMemo(
    () =>
      optionVoucherDiscount && optionVoucherDiscount.length ? true : false,
    [optionVoucherDiscount]
  );
  const isShowVoucherProduct = useMemo(
    () => (optionVoucherProduct && optionVoucherProduct.length ? true : false),
    [optionVoucherProduct]
  );

  return (
    <ModalContainer
      isOpen={visible}
      isBottom
      onDismiss={onDismiss}
      classNameBottom=""
    >
      <div className="w-full bg-white rounded-t-xl between-y">
        <div className="flex-1 flex flex-col px-4 pt-4 overflow-hidden relative">
          <div className="between-x mb-6">
            <label className="text-base font-semibold">Pilih Voucher</label>

            <div onClick={onDismiss} className="cursor-pointer">
              <IcClose className="text-black100" />
            </div>
          </div>

          <LoadingPage loading={voucherAvailable?.loading} color="primary100">
            <div className="overflow-auto scrollbar-none">
              <p className="mb-2.5">Voucher Potongan Harga</p>
              {isShowVoucherDiscount &&
                optionVoucherDiscount &&
                optionVoucherDiscount.map((item, index) => (
                  <VoucherCard
                    key={index}
                    data={item}
                    isActive={item?.value === selected?.value}
                    onSelectSK={() =>
                      dispatch(
                        setFromGlobal({
                          type: "openSKVoucher",
                          data: item?.data,
                          value: true,
                        })
                      )
                    }
                    onSelect={() => setSelected(item)}
                  />
                ))}

              <p className="mb-2.5">Voucher Produk</p>
              {isShowVoucherProduct &&
                optionVoucherProduct &&
                optionVoucherProduct.map((item, index) => (
                  <VoucherCard
                    key={index}
                    data={item}
                    isActive={item?.value === selected?.value}
                    onSelectSK={() =>
                      dispatch(
                        setFromGlobal({
                          type: "openSKVoucher",
                          data: item,
                          value: true,
                        })
                      )
                    }
                    onSelect={() => setSelected(item)}
                  />
                ))}
            </div>
          </LoadingPage>
        </div>

        {/* FOOTER */}
        <div className="container-button-footer">
          <Button
            label="Submit"
            disabled={selected ? false : true}
            onClick={() => onSelect(selected)}
          />
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalVoucher;
