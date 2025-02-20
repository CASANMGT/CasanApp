import { NavigateFunction, useNavigate } from "react-router-dom";
import {
  IcBackBlack,
  IcMenuWhite,
  IcMyLocationBlack,
  IcSearchBlack,
} from "../assets";
import { Map } from "../components";

const Location = () => {
  const navigate: NavigateFunction = useNavigate();

  const onDismiss = () => {
    navigate(-1);
  };

  const onShowAll = () => {
    navigate("/location-list");
  };

  return (
    <div className="container-screen relative">
      <div className=" w-full h-full relative">
        {/* MAP */}
        <Map />

        {/* SEARCH */}
        <div className="absolute top-4 left-4 right-4 row gap-4 drop-shadow">
          <div
            onClick={onDismiss}
            className="h-10 w-10 rounded-full bg-white cursor-pointer center"
          >
            <IcBackBlack />
          </div>

          <div
            onClick={onShowAll}
            className="row gap-2 flex-1 bg-white h-10 rounded-full drop-shadow px-4 cursor-pointer"
          >
            <p className="flex-1 text-black100/50 font-medium">Cari Lokasi</p>
            <IcSearchBlack />
          </div>
        </div>

        {/* MY LOCATION */}
        <div
          onClick={() => alert("coming soon")}
          className="absolute left-4 bottom-[94px] bg-white p-2 rounded-lg drop-shadow cursor-pointe"
        >
          <IcMyLocationBlack />
        </div>

        {/* ALL LIST */}
        <div
          onClick={onShowAll}
          className="row gap-1 absolute right-4 bottom-[94px] bg-blackBold/50 p-2 rounded-lg drop-shadow cursor-pointer"
        >
          <IcMenuWhite />
          <p className="text-white font-medium">Lihat Semua</p>
        </div>
      </div>
    </div>
  );
};

export default Location;
