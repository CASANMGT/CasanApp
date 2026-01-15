import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoArrowBackOutline, IoCloseOutline } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ERROR_MESSAGE } from "../common";
import { ChargingLocationCard, LoadingPage } from "../components";
import { Api } from "../services";
import { getCurrentLocation } from "../services/ApiAddress";

interface ResponseProps {
  status: string;
  message: string;
  data: ChargingStation[];
  meta: MetaResponseProps;
}

const SearchStation = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ResponseProps>();
  const [currentLocation, setCurrentLocation] = useState<LatLng>();

  const search = searchParams.get("search") || "";

  const debouncedData = useRef(
    debounce(async (q: string) => {
      getData(q);
    }, 500) //
  ).current;

  useEffect(() => {
    if (!currentLocation) getLocation();
  }, []);

  useEffect(() => {
    debouncedData(search);
  }, [search]);

  const getData = async (q?: string) => {
    try {
      setLoading(true);
      const res = await Api.get({
        url: "stations/search",
        params: { search: q || search },
      });

      setData(res);
    } catch (error: any) {
      alert(ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = async () => {
    try {
      const check = await getCurrentLocation();

      setCurrentLocation(check);
    } catch (error) {}
  };


  return (
    <div className="w-[480px] relative min-h-screen bg-[linear-gradient(225deg,_#BAE6E9_10%,_#FFFFFF_50%,_#FAF2C0_100%)]">
      {/* SEARCH */}
      <div className="row gap-4 p-4">
        <div
          onClick={() => navigate("/home", { replace: true })}
          className=" w-10 h-auto aspect-square rounded-full bg-baseLightGray/70 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <IoArrowBackOutline size={20} className="text-black100 " />
        </div>

        <div className="flex-1 row gap-3 rounded-full bg-baseLightGray/70 px-4">
          <CiSearch size={20} />

          <input
            value={search}
            onChange={(e) => setSearchParams({ search: e?.target?.value })}
            className="h-full w-full px-0 py-3 bg-transparent text-sm text-black100 focus:outline-none  disabled:text-black90 disabled:cursor-not-allowed"
          />

          {search && (
            <button onClick={() => setSearchParams({ search: "" })}>
              <IoCloseOutline size={20} className="text-black70" />
            </button>
          )}
        </div>
      </div>
      {/* AVAILABLE */}
      {(data?.meta?.total || 0) > 0 && (
        <div className="row gap-1.5 bg-primary10 px-4 py-3">
          <span className="text-base text-blackBold font-semibold">
            {data?.meta?.total || 0}
          </span>
          <span className="text-base">lokasi ditemukan</span>
        </div>
      )}

      {/* LIST */}
      <LoadingPage loading={loading} color="primary100">
        {data?.data?.length ? (
          <div className="h-screen overflow-y-auto scrollbar-none transition-all duration-300 p-4">
            {data?.data.map((item, index: number) => (
              <ChargingLocationCard
                key={index}
                data={item}
                currentLocation={currentLocation}
                onClick={() =>
                  navigate(`/station-details/${item?.ID}`, {
                    state: { currentLocation },
                  })
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-screen items-center justify-center p-8">
            <span className="text-base font-semibold">
              Stasiun Tidak Ditemukan
            </span>
            <span>Nama stasiun yang anda cari tidak ditemukan</span>
          </div>
        )}
      </LoadingPage>
    </div>
  );
};

export default SearchStation;
