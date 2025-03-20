export const openGoogleMaps = (lat: number, lon: number) => {
  const url = `https://www.google.com/maps?q=${lat},${lon}`;
  window.open(url, "_blank");
};

export const openWhatsApp = (phone: string) => {
  let newPhone: string = "";

  if (phone.slice(0, 1) === "0") newPhone = phone.slice(1);
  else if (phone.slice(0, 3) === "+62") newPhone = phone.slice(3);

  const url = `https://wa.me/62${phone}`;
  window.open(url, "_blank");
};
