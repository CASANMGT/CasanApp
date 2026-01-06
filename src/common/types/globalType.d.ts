export { };

declare global {
  type MenuBottomNavigationProps = {
    id: string;
    page: "index" | "location" | "scan" | "order" | "profile";
    label: string;
    isCenter?: boolean;
  };

  type bodyListProps = {
    page: number;
    limit: number;
    is_active?: boolean;
  };

  type AlertModalProps = {
    visible: boolean;
    image?: any;
    icon?: any;
    title?: string;
    loading?:boolean
    typeButtonLeft?: ButtonType;
    labelButtonLeft?: string;
    labelButtonRight?: string;
    typeButtonRight?: ButtonType;
    description?: string;
    onDismiss?: () => void;
    onClick?: () => void;
  };

  type OptionsProps = {
    name: string | number;
    value: string | number;
    target?: any;
    disabled?: boolean;
    data?: any;
    icon?: any;
    type?: string;
    error?: string;
  };

  type initialStateFormProps = {
    data: any;
    loading?: boolean;
    [key: string]: any;
  };

  type LatLng = [number, number];

  type MetaResponseProps = {
    limit: number;
    page: number;
    total: number;
  };

  type LocationResponse = {
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
    ChargingStations: ChargingStation[];
  };

  type ResponseSuccess = {
    message: string;
    status: string;
  };

  type TabItemProps = {
    id: string | number;
    label: string;
    content: any;
  };

  type ModalProps = {
    isOpen: boolean;
    isEdit?: boolean;
    data?: any;
    onClose: () => void;
    onConfirm?: (value?: any) => void;
  };

  type ButtonType =
    | "primary"
    | "secondary"
    | "danger"
    | "light-green"
    | "light-red"
    | "primary-line";
}
