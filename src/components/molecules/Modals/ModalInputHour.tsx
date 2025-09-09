import React, { useEffect, useState } from "react";
import { IcClose } from "../../../assets";
import { HOUR_SESSION } from "../../../common";
import { convertToHours, formatMinutesToHHMM } from "../../../helpers";
import { Button, Separator, WheelPicker } from "../../atoms";
import ModalContainer from "./ModalContainer";
import { NominalTopUpItem } from "../Items";

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
      setSelectTime([split[0] || "00", split[1] || "00"]);
    }
  }, [open]);

  const validation = (select: string) => {
    let condition = false;
    const convert = convertToHours(`${selectTime[0]}:${selectTime[1]}`);
    const current: number = Number(select || 1) / 60;

    if (convert === current) condition = true;

    return condition;
  };

  const handleChange = (select: string) => {
    if (select !== "full") {
      const newValue: string[] = formatMinutesToHHMM(Number(select)).split(":");
      setSelectTime([newValue[0], newValue[1]]);
    }
  };

  const isError: boolean = totalMinute(selectTime) > 720 ? true : false;

  return (
    <ModalContainer
      isOpen={open}
      isBottom
      onDismiss={onDismiss}
      classNameBottom="!h-auto"
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

          {isError && (
            <div className="border-t border-t-red bg-lightRed px-3 py-1.5 rounded-b-sm text-red text-xs">
              <p>
                Max. <span className="font-semibold">12 Jam</span>
              </p>
            </div>
          )}

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-3 ">
            {HOUR_SESSION.map((item, index: number) => (
              <NominalTopUpItem
                key={index}
                type="hour"
                value={item}
                isActive={validation(item)}
                onClick={() => {
                  handleChange(item);
                }}
              />
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6">
          <Button
            buttonType="lg"
            label="Pilih"
            disabled={isError}
            onClick={() => onChange(`${selectTime[0]}:${selectTime[1]}`)}
          />
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalInputHour;

const totalMinute: (time: [string, string]) => number = (
  time: [string, string]
) => {
  const hours = parseInt(time[0], 0);
  const minutes = parseInt(time[1], 0);

  return hours * 60 + minutes;
};
