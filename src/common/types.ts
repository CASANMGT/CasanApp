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
