import { Marker, OverlayView } from "@react-google-maps/api";
import { IcFuel } from "../../../assets";
import { CoordinateProps } from "../../../common";
import { rupiah } from "../../../helpers";

interface CustomMarkerMapProps {
  center: CoordinateProps;
}

const CustomMarkerMap: React.FC<CustomMarkerMapProps> = ({ center }) => {
  return (
    <>
      <Marker
        position={center}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#18ACB6",
          fillOpacity: 0.7,
          strokeColor: "#18ACB6",
          strokeWeight: 2,
        }}
      />

      <OverlayView
        position={center}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      >
        <div className="relative transform -translate-x-1/2 -translate-y-full">
          {/* Marker container */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-white drop-shadow rounded-lg border-[1.5px] border-black100/10 px-4 py-3 text-center w-fit z-10">
            <div className="row gap-0.5 font-semibold">
              <span className="text-xs">Rp</span>
              <span className="text-lg">{rupiah(600)}/jam</span>
            </div>

            <div className="row gap-1 mt-1 text-black100/70">
              <IcFuel className="text-primary100" />
              <span className="text-xs">Tersedia</span>
              <span className="text-sm text-teal-500 font-bold ml-1">4</span>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 "></div>
        </div>
      </OverlayView>
    </>
  );
};

export default CustomMarkerMap;
