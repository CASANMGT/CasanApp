export const openGoogleMaps = (lat: number, lon: number) => {
  const url = `https://www.google.com/maps?q=${lat},${lon}`;
  window.open(url, "_blank");
};

/** Open Google Maps search (address or place name) */
export const openGoogleMapsSearch = (query: string) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.trim())}`;
  window.open(url, "_blank");
};

export const openWhatsApp = (phone: string) => {
  let newPhone: string = "";

  if (phone.slice(0, 1) === "0") newPhone = phone.slice(1);
  else if (phone.slice(0, 3) === "+62") newPhone = phone.slice(3);

  const url = `https://wa.me/62${newPhone}`;
  window.open(url, "_blank");
};

export const openURL = (url: string) => {
  window.location.href = url;
};
