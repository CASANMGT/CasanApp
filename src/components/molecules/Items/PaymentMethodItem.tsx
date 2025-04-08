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
  balance?: number | undefined;
  position?: number;
  isActive: boolean;
  disabled?: boolean;
  icon: any;
  onSelect: () => void;
}

const PaymentMethodItem: React.FC<PaymentMethodItemProps> = ({
  type,
  icon,
  label,
  balance,
  position,
  isActive,
  disabled,
  onSelect,
}) => {
  const isShowBalance: boolean = useMemo(
    () => (balance !== undefined ? true : false),
    [balance]
  );

  const isShowSeparator: boolean = useMemo(
    () => (position && position > 0 ? true : false),
    [position]
  );

  const Icon = icon
  
  return (
    <>
      {isShowSeparator && <Separator className="my-4" />}

      <div
        onClick={onSelect}
        className={`between-x ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div className="row gap-2">
          <Icon />
          <p className="font-medium">
            {label}{" "}
            {isShowBalance && (
              <span className="text-xs">{`(Rp${rupiah(balance || 0)})`}</span>
            )}
          </p>
        </div>

        <div className={`${disabled && "opacity-50"}`}>
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
      </div>
    </>
  );
};

export default PaymentMethodItem;
