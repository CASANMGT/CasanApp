import React, { useMemo } from "react";
import {
  IcCheckboxActive,
  IcCheckboxActiveDisabled,
  IcCheckboxInactive,
} from "../../assets";
import { rupiah } from "../../helpers";

interface Props {
  className?: string;
  isActive: boolean;
  disabled?: boolean;
  label: string;
  price?: number;
  size?: number;
  isSwitch?: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<Props> = ({
  className,
  isActive,
  label,
  disabled,
  size = 24,
  price,
  isSwitch,
  onChange,
}) => {
  const isShowPrice: boolean = useMemo(() => (price ? true : false), [price]);

  return (
    <div
      className={`row gap-2 cursor-pointer ${className}`}
      onClick={() => !disabled && onChange()}
    >
      {isSwitch && (
        <span className="row flex-1 font-medium">
          {label}{" "}
          {isShowPrice && (
            <p className="ml-1 font-bold">{`Rp${rupiah(price || 0)}`}</p>
          )}
        </span>
      )}
      
      {isActive ? (
        disabled ? (
          <IcCheckboxActiveDisabled
            className={`w-${size / 4} h-${size / 4} `}
          />
        ) : (
          <IcCheckboxActive className={`w-${size / 4} h-${size / 4} `} />
        )
      ) : (
        <IcCheckboxInactive className={`w-${size / 4} h-${size / 4}`} />
      )}

      {!isSwitch && (
        <span className="row flex-1 font-medium">
          {label}{" "}
          {isShowPrice && (
            <p className="ml-1 font-bold">{`Rp${rupiah(price || 0)}`}</p>
          )}
        </span>
      )}
    </div>
  );
};

export default Checkbox;
