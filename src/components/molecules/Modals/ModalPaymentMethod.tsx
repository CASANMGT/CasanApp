import React, { useEffect, useState } from "react";
import {
  IcAstraPay,
  IcClose,
  IcDana,
  IcGopay,
  IcLinkAja,
  IcQris,
  IcShopeePay,
  IcWallet,
} from "../../../assets";
import {
  ASTRAPAY,
  DANA,
  GOPAY,
  LINK_AJA,
  QRIS,
  SHOPEEPAY,
} from "../../../common";
import { Button } from "../../atoms";
import { PaymentMethodItem } from "../Items";
import ModalContainer from "./ModalContainer";

interface ModalPaymentMethodProps {
  visible: boolean;
  select: string;
  onDismiss: () => void;
  onSelect: (value: string) => void;
}

const ModalPaymentMethod: React.FC<ModalPaymentMethodProps> = ({
  visible,
  select,
  onDismiss,
  onSelect,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<string>();

  useEffect(() => {
    if (visible) {
      setSelectedPayment(select);
    }
  }, [visible]);

  return (
    <ModalContainer visible={visible} isBottom onDismiss={onDismiss}>
      <div className="w-full bg-white p-4 rounded-t-xl between-y">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="between mb-6">
            <label className="text-base font-semibold">
              Pilih Metode Pembayaran
            </label>

            <div onClick={onDismiss} className="cursor-pointer">
              <IcClose className="text-black100" />
            </div>
          </div>

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

            {dataEWalletDummy.map((item, index: number) => (
              <PaymentMethodItem
                key={item?.key}
                icon={item?.icon}
                label={item?.label}
                position={index}
                isActive={selectedPayment === item?.key}
                onSelect={() => setSelectedPayment(item?.key)}
              />
            ))}

            <div className="h-6" />
          </div>
        </div>

        {/* FOOTER */}
        <div className="">
          <Button
            buttonType="lg"
            label="Pilih"
            disabled={!selectedPayment}
            onClick={() => {
              onSelect(selectedPayment || "");
              onDismiss();
            }}
          />
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalPaymentMethod;

const dataEWalletDummy = [
  {
    key: QRIS,
    label: "QRIS",
    icon: IcQris,
  },
  {
    key: GOPAY,
    label: "GoPay",
    icon: IcGopay,
  },
  {
    key: DANA,
    label: "Dana",
    icon: IcDana,
  },
  {
    key: SHOPEEPAY,
    label: "ShopeePay",
    icon: IcShopeePay,
  },
  {
    key: LINK_AJA,
    label: "Link Aja",
    icon: IcLinkAja,
  },
  {
    key: ASTRAPAY,
    label: "Astrapay",
    icon: IcAstraPay,
  },
];
