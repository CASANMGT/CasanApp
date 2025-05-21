import React, { useEffect, useState } from "react";
import { IcClose } from "../../../assets";
import { NOMINAL_SESSION, REGEX_NUMBERS } from "../../../common";
import { replaceNominal, rupiah } from "../../../helpers";
import { Button, Separator } from "../../atoms";
import { NominalTopUpItem } from "../Items";
import ModalContainer from "./ModalContainer";

interface ModalInputNominalProps {
  open: boolean;
  value: string;
  balance?: number;
  onDismiss: () => void;
  onChangeText: (value: string) => void;
}

const ModalInputNominal: React.FC<ModalInputNominalProps> = ({
  open,
  value,
  balance,
  onDismiss,
  onChangeText,
}) => {
  const [selectTime, setSelectTime] = useState<[string, string]>(["00", "00"]);
  const [nominal, setNominal] = useState<string>("Rp0");

  useEffect(() => {
    if (open) {
      setNominal(value);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value.replace(REGEX_NUMBERS, "");
    const formatted: string = `Rp${rupiah(value)}`;

    setNominal(formatted);
  };

  const isError: boolean = replaceNominal(nominal) > 120000 ? true : false;

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
            <label className="text-base font-semibold">Masukan Nominal</label>

            <div onClick={onDismiss} className="cursor-pointer">
              <IcClose className="text-black100" />
            </div>
          </div>

          <p className="text-xs text-black100/70 mb-[14px]">
            Silakan masukkan nominal pengisian yang sesuai dengan kebutuhan anda
          </p>

          <div
            className={`bg-baseGray center  px-1 ${
              isError ? "rounded-t-lg" : "rounded-lg"
            }`}
          >
            <input
              type={"text"}
              inputMode="numeric"
              placeholder={"0"}
              value={nominal}
              onChange={handleChange}
              className="z-10 w-auto text-center p-4 w-full text-base font-semibold bg-transparent"
            />
          </div>
          {isError && (
            <div className="border-t border-t-red bg-lightRed px-3 py-1.5 rounded-b-sm text-red text-xs">
              <p>
                Max. <span className="font-semibold">Rp120.000</span>
              </p>
            </div>
          )}

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-3 ">
            {NOMINAL_SESSION.map((item, index: number) => (
              <NominalTopUpItem
                key={index}
                value={item}
                isActive={
                  Number(item === "full" ? balance : item) ===
                  Number(value.replace("Rp", "").replace(/\./g, ""))
                }
                onClick={() => {
                  let value = "";
                  if (item === "full" && balance && balance > 0)
                    value = balance.toString();
                  else value = item;

                  setNominal(`Rp${rupiah(value)}`);
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
            onClick={() => onChangeText(nominal || "Rp0")}
          />
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalInputNominal;
