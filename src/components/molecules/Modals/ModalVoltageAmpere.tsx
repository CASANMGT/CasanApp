import React, { useEffect, useState } from "react";
import { IcFlashCircleGreen } from "../../../assets";
import { OptionsProps } from "../../../common";
import { Button, Dropdown } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface ModalVoltageAmpereProps {
  visible: boolean;
  select: {
    voltage: string | number;
    ampere: string | number;
  };
  onDismiss: () => void;
  onSelect: (select: {
    voltage: string | number | undefined;
    ampere: string | number | undefined;
  }) => void;
}

const ModalVoltageAmpere: React.FC<ModalVoltageAmpereProps> = ({
  visible,
  select,
  onDismiss,
  onSelect,
}) => {
  const [voltage, setVoltage] = useState<string | number>();
  const [ampere, setAmpere] = useState<string | number>();

  useEffect(() => {
    if (visible) {
      setVoltage(select?.voltage);
      setAmpere(select.ampere);
    }
  }, [visible]);

  return (
    <ModalContainer isOpen={visible} onDismiss={onDismiss}>
      <div className="row gap-3 mb-3">
        <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
          <IcFlashCircleGreen />
        </div>

        <span className="text-blackBold font-medium">Spesifikasi Alat</span>
      </div>

      <Dropdown
        select={voltage}
        placeholder="Voltage"
        options={optionsVoltage}
        onSelect={(select) => setVoltage(select.value)}
        className="mb-3"
      />

      <Dropdown
        select={ampere}
        placeholder="Ampere"
        options={optionsAmpere}
        onSelect={(select) => setAmpere(select.value)}
        className="mb-3"
      />

      <Button
        label="Simpan"
        onClick={() => {
          onSelect({
            voltage,
            ampere,
          });
        }}
      />
    </ModalContainer>
  );
};

export default ModalVoltageAmpere;

const optionsVoltage: OptionsProps[] = [
  { name: "48V", value: 48 },
  { name: "60V", value: 60 },
  { name: "72V", value: 72 },
];

const optionsAmpere: OptionsProps[] = Array.from({ length: 20 }, (_, i) => {
  const current: number = i + 1;
  const newItem: OptionsProps = {
    name: `${current}A`,
    value: current,
  };

  return newItem;
});
