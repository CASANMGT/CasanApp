import React, { useEffect, useState } from "react";
import { IcClose } from "../../../assets";
import { NOMINAL } from "../../../common";
import { convertToHours } from "../../../helpers";
import { Button, Separator, WheelPicker } from "../../atoms";
import { NominalTopUpItem } from "../Items";
import ModalContainer from "./ModalContainer";

interface ModalInputHourProps {
  open: boolean;
  value: string;
  onDismiss: () => void;
  onChange: (value: string) => void;
}

const ModalInputHour: React.FC<ModalInputHourProps> = ({
  open,
  value,
  onDismiss,
  onChange,
}) => {
  const [selectTime, setSelectTime] = useState<[string, string]>(["00", "00"]);

  useEffect(() => {
    if (open) {
      const split = value.split(":");
      setSelectTime([split[0], split[1]]);
    }
  }, [open]);

  const validation = (select: string) => {
    let condition = false;
    const convert = convertToHours(`${selectTime[0]}:${selectTime[1]}`);

    if (String(convert) === select) condition = true;

    return condition;
  };

  const handleChange = (select: string) => {
    if (select !== "full") {
      setSelectTime([String(select).padStart(2, "0"), "00"]);
    }
  };

  return (
    <ModalContainer
      visible={open}
      isBottom
      onDismiss={onDismiss}
      classNameBottom="!h-[400px]"
    >
      <div className="w-full bg-white p-4 rounded-t-xl between-y">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="between-x mb-2.5">
            <label className="text-base font-semibold">Masukan Jam</label>

            <div onClick={onDismiss} className="cursor-pointer">
              <IcClose className="text-black100" />
            </div>
          </div>

          <p className="text-xs text-black100/70 mb-[14px]">
            Silakan masukkan waktu pengisian sesuai dengan daya kebutuhan anda
          </p>

          <WheelPicker
            value={selectTime}
            onChange={(value) => setSelectTime(value)}
          />

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-3 ">
            {NOMINAL.map((item, index: number) => (
              <NominalTopUpItem
                key={index}
                value={item}
                isActive={validation(item)}
                isHour
                onClick={() => {
                  handleChange(item);
                }}
              />
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="">
          <Button
            buttonType="lg"
            label="Pilih"
            onClick={() => onChange(`${selectTime[0]}:${selectTime[1]}`)}
          />
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalInputHour;
