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

export type OptionDropdownProps = {
  name: string | number;
  value: string | number;
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