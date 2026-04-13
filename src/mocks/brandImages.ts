// Dummy brand image URLs for preview/testing
export const brandImages = [
  "https://firebasestorage.googleapis.com/v0/b/tebengan-project.firebasestorage.app/o/images%2Fimages.png?alt=media&token=784273af-c7d1-4d10-ac54-951aa09d8e77",
  "https://via.placeholder.com/100/111110/FFFFFF?text=U", // United - black
  "https://via.placeholder.com/100/21D0F9/FFFFFF?text=M", // Maka - cyan
  "https://via.placeholder.com/100/FE5900/FFFFFF?text=T", // Tangkas - orange
];

export const getBrandImage = (index: number): string => {
  return brandImages[index % brandImages.length];
};

// Minimal mock station for preview
export const mockStationForPreview = {
  ID: 1,
  Name: "Preview Station",
  Brand: 1,
  IsVisibleToUser: true,
  Location: { Latitude: -6.2088, Longitude: 106.8456, Address: "Test Address" },
  Devices: [
    { ID: 1, Name: "Device 1", Brand: 1, MaxWatt: 2000, TotalSocket: 2, SignalValue: 4, Type: 1, Sockets: [] },
    { ID: 2, Name: "Device 2", Brand: 2, MaxWatt: 2700, TotalSocket: 2, SignalValue: 4, Type: 1, Sockets: [] },
  ],
  PriceSetting: {
    BikePriceType: 1,
    PriceBaseRules: [{ From: 0, To: 2700 }],
  },
};
