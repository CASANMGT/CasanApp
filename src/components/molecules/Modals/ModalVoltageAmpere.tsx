import React, { useEffect, useState } from "react";
import { IcFlashCircleGreen } from "../../../assets";
import { OptionsProps } from "../../../common";
import { Button, Dropdown } from "../../atoms";
import ModalContainer from "./ModalContainer";

interface ModalVoltageAmpereProps {
  visible: boolean;
  select: {
    voltage: OptionsProps | undefined;
    ampere: OptionsProps | undefined;
  };
  onDismiss: () => void;
  onSelect: (select: {
    voltage: OptionsProps | undefined;
    ampere: OptionsProps | undefined;
  }) => void;
}

const ModalVoltageAmpere: React.FC<ModalVoltageAmpereProps> = ({
  visible,
  select,
  onDismiss,
  onSelect,
}) => {
  const [voltage, setVoltage] = useState<OptionsProps>();
  const [ampere, setAmpere] = useState<OptionsProps>();

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

      <div className="flex flex-row gap-3">
        <Dropdown
          select={voltage?.name}
          placeholder="Voltage"
          options={optionsVoltage}
          onSelect={(select) => setVoltage(select)}
        />

        <Dropdown
          select={ampere?.name}
          placeholder="Ampere"
          options={optionsAmpere}
          onSelect={(select) => setAmpere(select)}
        />
      </div>

      <Button
        label="Simpan"
        onClick={() => {
          onSelect({
            voltage,
            ampere,
          });
        }}
        className="mt-4"
      />
    </ModalContainer>
  );
};

export default ModalVoltageAmpere;

const optionsVoltage: OptionsProps[] = [
  { name: "48V", value: 54.6 },
  { name: "60V", value: 67.2 },
  { name: "72V", value: 84 },
];

const optionsAmpere: OptionsProps[] = Array.from({ length: 20 }, (_, i) => {
  const current: number = i + 1;
  const newItem: OptionsProps = {
    name: `${current}A`,
    value: current,
  };

  return newItem;
});
