import {
  IcCasanCircle,
  IcMakaCircle,
  IcTangkasCircle,
  IcUnitedCircle,
} from "../../assets";

export const AVAILABLE_PLACE: string[] = ["Terdekat", "Termurah", "Tersedia"];
export const POWER_SESSION: string[] = ["1", "2", "3", "4"];
export const HOUR_SESSION: string[] = ["30", "60", "90", "120"];
export const NOMINAL_SESSION: string[] = ["10000", "20000", "30000", "40000"];
export const NOMINAL_TOP_UP: string[] = ["5000", "10000", "20000", "50000"];

export const ChargeBrandOption: OptionsProps[] = [
  { name: "Casan", icon: IcCasanCircle, value: 1 },
  { name: "United", icon: IcUnitedCircle, value: 2 },
  { name: "Maka Motors", icon: IcMakaCircle, value: 3 },
  { name: "Tangkas", icon: IcTangkasCircle, value: 4 },
];
