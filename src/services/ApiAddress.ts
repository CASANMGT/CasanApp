import { GeocodeResult } from "../common";

export const getCurrentLocation = (): Promise<[number, number]> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation tidak didukung browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos?.coords;
        resolve([latitude, longitude]);
      },
      (err) => reject(err.message),
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  });
};

export const getGeoCode = ({
  placeId = "",
  address = "",
}: {
  placeId?: string;
  address?: string;
}): Promise<GeocodeResult> => {
  return new Promise((resolve, reject) => {
    const service = new window.google.maps.Geocoder();

    service.geocode({ placeId, region: "id", address }, (results, status) => {
      if (
        status === window.google.maps.GeocoderStatus.OK &&
        results &&
        results[0]
      ) {
        const { address_components, place_id, geometry, formatted_address } =
          results[0];

        let district = address_components[0]?.long_name || "";
        let city = address_components[0]?.long_name || "";
        let province = address_components[0]?.long_name || "";

        for (let i = 4; i > 0; i--) {
          const area = address_components.find((x) =>
            x.types.includes(`administrative_area_level_${i}`)
          );
          if (area) {
            if (i === 3) district = area.long_name;
            else if (i === 2) city = area.long_name;
            else if (i === 1) province = area.long_name;
          }
        }

        const coordinate = {
          lat: geometry.location.lat(),
          lon: geometry.location.lng(),
        };

        const item: GeocodeResult = {
          place_id,
          district,
          city,
          province,
          name: formatted_address,
          coordinate,
        };

        resolve(item);
      } else {
        reject(new Error("Coordinates not found."));
      }
    });
  });
};
