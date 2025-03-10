export type MenuBottomNavigationProps = {
  id: string;
  page: string;
  label: string;
  isCenter?: boolean;
};

export type AlertModalProps = {
  visible: boolean;
  image?: any;
  title?: string;
  description?: string;
  onDismiss: () => void;
  onClick?: () => void;
};

export type CoordinateProps = {
  lat: number;
  lng: number;
};

export type OptionsProps = {
  name: string | number;
  value: string | number;
  target?: any;
  disabled?: boolean;
  data?: any;
};

export type chargingLocationProps = {
  image: string;
  location: string;
  address: string;
  status: "full" | "available";
  available: number;
  cost: number;
  voltage: number;
  ampere: number;
  distance: number;
};

export type socketProps = {
  socket: number;
  status: "used" | "available" | "broken";
};

export type initialStateFormProps = {
  data: any;
  loading?: boolean;
  [key: string]: any;
};

export type LatLng = [number, number];


export type MetaResponseProps = {
  limit: number;
  page: number;
  total: number;
};

export type LocationResponse = {
  ID: number;
  Name: string;
  Address: string;
  PlaceID: string;
  Mark: string;
  District: string;
  City: string;
  Province: string;
  Longitude: number;
  Latitude: number;
  DeletedAt: any;
  CreatedAt: string;
  UpdatedAt: string;
};

export type ResponseSuccess = {
  message: string;
  status: string;
};

export type TabItemProps = {
  id: string | number;
  label: string;
  content: any;
};
