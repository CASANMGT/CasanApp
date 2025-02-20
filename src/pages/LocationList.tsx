import { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IcBackBlack, IcPinGreen, IcSearchGray } from "../assets";
import { ChargingLocationCard, Label } from "../components";
import { chargingLocationProps } from "../common";
import { DummyAeon, DummyTheBreeze } from "../assets/dummy";

const LocationList = () => {
  const navigate: NavigateFunction = useNavigate();

  const [type, setType] = useState<string>("Semua");

  const onDismiss = () => {
    navigate(-1);
  };

  const onSearch = () => {
    alert("coming soon");
  };

  return (
    <div className="background-1 overflow-hidden flex flex-col">
      {/* SEARCH */}
      <div className="row gap-4 drop-shadow mx-4 mt-4">
        <div
          onClick={onDismiss}
          className="h-10 w-10 rounded-full bg-baseLightGray/70 cursor-pointer center"
        >
          <IcBackBlack />
        </div>

        <div
          onClick={onSearch}
          className="row gap-2 flex-1 bg-baseLightGray/70 h-10 rounded-full drop-shadow px-4 cursor-pointer"
        >
          <IcSearchGray />
          <p className="flex-1 text-black50 font-medium">
            Cari lokasi pengecekan
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="between mx-4 mt-5">
        <div className="row gap-3">
          <Label
            label="Semua"
            isActive={type === "Semua"}
            onClick={() => setType("Semua")}
          />
          <Label
            label="Tersedia"
            isActive={type === "Tersedia"}
            onClick={() => setType("Tersedia")}
          />
        </div>

        <div className="row rounded-full bg-white/30 h-[28px] center px-[14px] text-xs text-primary100">
          <IcPinGreen />
          <span className="font-semibold ml-1">Tangerang</span>
          <span className="font-medium">, Indonesia</span>
        </div>
      </div>

      {/* LIST */}
      <div className="overflow-auto px-4 pt-3 scrollbar-none">
        {dataDummy.map((item, index: number) => (
          <ChargingLocationCard
            key={index}
            type="location-list"
            data={item}
            onClick={() => navigate("/charging-location-details")}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationList;

const dataDummy: chargingLocationProps[] = [
  {
    image: DummyTheBreeze,
    location: "The Breeze",
    address:
      "Jl. BSD Green Office Park Jl. BSD Grand Boulevard, Sampora, BSD, Kabupaten Tangerang",
    status: "full",
    available: 0,
    cost: 600,
    voltage: 48,
    ampere: 2,
    distance: 2,
  },
  {
    image: DummyAeon,
    location: "Aeon Mall",
    address:
      "Jl. BSD Raya Utama, Pagedangan, Kec. Pagedangan, Kabupaten Tangerang, Banten",
    status: "available",
    available: 5,
    cost: 600,
    voltage: 48,
    ampere: 2,
    distance: 2,
  },
];
