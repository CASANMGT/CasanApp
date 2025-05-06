import { ChargingStation, PriceSetting } from "./chargingStationsType";

export type MenuBottomNavigationProps = {
  id: string;
  page: string;
  label: string;
  isCenter?: boolean;
};

export type bodyListProps = {
  page: number;
  limit: number;
};

export type AlertModalProps = {
  visible: boolean;
  image?: any;
  icon?: any;
  title?: string;
  typeButtonLeft?: ButtonType;
  labelButtonLeft?: string;
  labelButtonRight?: string;
  description?: string;
  onDismiss?: () => void;
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
  icon?: any;
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
  ChargingStations: ChargingStation[]
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

export type ButtonType =
  | "primary"
  | "secondary"
  | "danger"
  | "light-green"
  | "light-red"
  | "primary-line";
