export const getCurrentLocation = (): Promise<[number, number]> => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject("Google Maps API not loaded");
        return;
      }
  
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by this browser");
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve([latitude, longitude]);
        },
        (error) => {
          reject(`Can't get current location: ${error.message}`);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };
  