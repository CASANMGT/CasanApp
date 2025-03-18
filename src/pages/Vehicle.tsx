import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IcFlashCircleGreen,
  IcInfoCircle,
  IcScooterGreen,
} from "../assets";
import { OptionDropdownProps } from "../common";
import { Button, Dropdown, Header, Input, SubTitle } from "../components";

const optionDummy: OptionDropdownProps[] = [
  { name: "1A", value: 1 },
  { name: "2A", value: 2 },
  { name: "5A", value: 3 },
];

const Vehicle = () => {
  const navigate = useNavigate();

  const [vehicleName, setVehicleName] = useState<string>("");
  const [charging, setCharging] = useState<OptionDropdownProps>();
  const [batery, setBatery] = useState<OptionDropdownProps>();

  const onDismiss = () => {
    navigate(-1);
  };

  const onNext = () => {
    alert("coming soon");
  };

  return (
    <div className="background-1 flex flex-col justify-between overflow-hidden">
      <Header type="secondary" title="Kendaraan" onDismiss={onDismiss} />

      <div className="flex-1 overflow-auto scrollbar-none p-4">
        {/* INFORMATION */}
        <div className="bg-baseLightGray/60 rounded-lg p-3 row gap-2 mb-4">
          <IcInfoCircle  className="text-primary100"/>

          <p className="text-xs text-black90">
            Isi Informasi Kendaraan untuk membantu memperkirakan biaya dan waktu
            pengisian daya
          </p>
        </div>

        {/* VEHICLE INFORMATION */}
        <div className="bg-white rounded-lg p-3 drop-shadow mb-4 ">
          <SubTitle
            icon={IcScooterGreen}
            label="Informasi Kendaraan"
            className="mb-3"
          />

          <Input
            value={vehicleName}
            placeholder="Nama Kendaraan"
            onChange={(value) => setVehicleName(value)}
          />
        </div>

        {/* TOOL INFORMATION */}
        <div className="bg-white rounded-lg p-3 drop-shadow">
          <SubTitle
            icon={IcFlashCircleGreen}
            label="Informasi Alat"
            className="mb-3"
          />

          <Dropdown
            select={charging?.name}
            placeholder="Kategori Charging"
            options={optionDummy}
            onSelect={(select) => setCharging(select)}
          />

          <Dropdown
            className="mt-3"
            select={batery?.name}
            placeholder="Kategori Baterai"
            options={optionDummy}
            onSelect={(select) => setBatery(select)}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 bg-white drop-shadow">
        <Button label="Simpan" onClick={onNext} />
      </div>
    </div>
  );
};

export default Vehicle;
