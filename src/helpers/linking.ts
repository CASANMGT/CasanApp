export const openGoogleMaps = (lat: number, lon: number) => {
  const url = `https://www.google.com/maps?q=${lat},${lon}`;
  window.open(url, "_blank");
};

export const openWhatsApp = (phone: string) => {
  const url = `https://wa.me/62${phone}`;
  window.open(url, "_blank");
};

export const openURL = (url: string) => {
  window.location.href = url;
};
