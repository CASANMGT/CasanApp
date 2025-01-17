import { useMemo } from "react";
import {
  IcCheckboxActive,
  IcCheckboxInactive,
  IcRadioActive,
  IcRadioInactive,
  IcWallet,
} from "../../../assets";
import { rupiah } from "../../../helpers";
import { Separator } from "../../atoms";

interface PaymentMethodItemProps {
  type?: "checkbox" | "radio";
  label: string;
  balance?: number;
  position?: number;
  isActive: boolean;
  onSelect: () => void;
}

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({
  type,
  label,
  balance,
  position,
  isActive,
  onSelect,
}) => {
  const isShowBalance: boolean = useMemo(
    () => (balance ? true : false),
    [balance]
  );

  const isShowSeparator: boolean = useMemo(
    () => (position && position > 0 ? true : false),
    [position]
  );

  return (
    <>
      {isShowSeparator && <Separator className="my-4" />}

      <div onClick={onSelect} className="between cursor-pointer">
        <div className="row gap-2">
          <IcWallet />
          <p className="font-medium">
            {label}{" "}
            {isShowBalance && (
              <span className="text-xs">{`(Rp${rupiah(balance || 0)})`}</span>
            )}
          </p>
        </div>

        {type === "checkbox" ? (
          isActive ? (
            <IcCheckboxActive />
          ) : (
            <IcCheckboxInactive />
          )
        ) : isActive ? (
          <IcRadioActive />
        ) : (
          <IcRadioInactive />
        )}
      </div>
    </>
  );
};

export default PaymentMethodItem;
