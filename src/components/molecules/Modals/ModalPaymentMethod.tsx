import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IcClose, IcWallet } from "../../../assets";
import { FeeSettingsProps } from "../../../common";
import { fetchFeeSettings } from "../../../features";
import { getIconPaymentMethod } from "../../../helpers";
import { AppDispatch, RootState } from "../../../store";
import { Button, LoadingPage } from "../../atoms";
import { PaymentMethodItem } from "../Items";
import ModalContainer from "./ModalContainer";

interface ModalPaymentMethodProps {
  visible: boolean;
  select: FeeSettingsProps | undefined;
  onDismiss: () => void;
  onSelect: (value: FeeSettingsProps | undefined) => void;
}

const ModalPaymentMethod: React.FC<ModalPaymentMethodProps> = ({
  visible,
  onDismiss,
  onSelect,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const feeSettings = useSelector((state: RootState) => state.feeSettings);

  const [optionsPaymentMethod, setOptionsPaymentMethod] =
    useState<FeeSettingsProps[]>();
  const [selectedPayment, setSelectedPayment] = useState<FeeSettingsProps>();

  useEffect(() => {
    if (visible) {
      getData();
    }
  }, [visible]);

  useEffect(() => {
    if (feeSettings?.data) {
      if (feeSettings?.data && feeSettings?.data.length) {
        const dataTopUp = feeSettings?.data.filter(
          (item) => item.Code.split("_")[1] === "TU"
        );
        const newDataTop: FeeSettingsProps[] = [];

        dataTopUp.forEach((item) => {
          const newItem: FeeSettingsProps = {
            key: item.Code,
            icon: getIconPaymentMethod(
              item.Code.split("_")[0].toLocaleLowerCase()
            ),
            label: item.Name,
            priceType: item?.IsPercentage ? "percentage" : "fixed",
            value: item.Value.toString(),
          };

          newDataTop.push(newItem);
        });

        setOptionsPaymentMethod(newDataTop);
      }
    }
  }, [feeSettings?.data]);

  const getData = () => {
    dispatch(fetchFeeSettings());
  };

  return (
    <ModalContainer visible={visible} isBottom onDismiss={onDismiss}>
      <div className="w-full bg-white p-4 rounded-t-xl between-y">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="between-x mb-6">
            <label className="text-base font-semibold">
              Pilih Metode Pembayaran
            </label>

            <div onClick={onDismiss} className="cursor-pointer">
              <IcClose className="text-black100" />
            </div>
          </div>

          <LoadingPage loading={feeSettings?.loading} colorLoading="primary100">
            <div className="overflow-auto">
              <p className="text-black70 mb-2.5">Saldo Anda</p>
              <PaymentMethodItem
                type="checkbox"
                label="Saldo"
                balance={0}
                isActive={false}
                icon={IcWallet}
                disabled={true}
                onSelect={() => {}}
              />

              <p className="text-black70 mb-2.5 mt-4">EWallet</p>

              {optionsPaymentMethod &&
                optionsPaymentMethod.map((item, index: number) => (
                  <PaymentMethodItem
                    key={item?.key}
                    icon={item?.icon}
                    label={item?.label}
                    position={index}
                    isActive={selectedPayment?.key === item?.key}
                    onSelect={() => setSelectedPayment(item)}
                  />
                ))}

              <div className="h-6" />
            </div>
          </LoadingPage>
        </div>

        {/* FOOTER */}
        <div className="">
          <Button
            buttonType="lg"
            label="Pilih"
            disabled={!selectedPayment}
            onClick={() => {
              onSelect(selectedPayment);
              onDismiss();
            }}
          />
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalPaymentMethod;
