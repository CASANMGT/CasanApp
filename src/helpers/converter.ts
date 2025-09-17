import { jwtDecode } from "jwt-decode";
import { FaLeaf, FaTree } from "react-icons/fa6";
import { RiMotorbikeFill, RiShieldCheckFill, RiTreeFill } from "react-icons/ri";
import {
  IcAstraPay,
  IcDana,
  IcGopay,
  IcLinkAja,
  IcNoImage,
  IcOvo,
  IcQris,
  IcShopeePay,
} from "../assets";
import {
  ASTRAPAY,
  DANA,
  GOPAY,
  LINK_AJA,
  OVO,
  QRIS,
  SHOPEEPAY,
} from "../common";

interface TokenPayload {
  id: string;
  role: string;
  exp: number;
  iat: number;
}

export const getIconPaymentMethod: (type: string) => any = (type: string) => {
  let icon: any = "";

  switch (type) {
    case QRIS:
      icon = IcQris;
      break;

    case GOPAY:
      icon = IcGopay;
      break;

    case DANA:
      icon = IcDana;
      break;

    case "shopee":
    case SHOPEEPAY:
      icon = IcShopeePay;
      break;

    case "linkaja":
    case LINK_AJA:
      icon = IcLinkAja;
      break;

    case OVO:
      icon = IcOvo;
      break;

    case ASTRAPAY:
      icon = IcAstraPay;
      break;

    default:
      icon = IcNoImage;
      break;
  }

  return icon;
};

export const getLabelPaymentMethod: (type: string) => string = (
  type: string
) => {
  let label: string = "";

  switch (type) {
    case QRIS:
      label = "QRIS";
      break;

    case GOPAY:
      label = "GoPay";
      break;

    case DANA:
      label = "Dana";
      break;

    case "shopee":
    case SHOPEEPAY:
      label = "Shopeepay";
      break;

    case "linkaja":
    case LINK_AJA:
      label = "Link Aja";
      break;

    case ASTRAPAY:
      label = "AstraPay";
      break;

    case "balance_fu":
      label = "Saldo Casan";
      break;

    case "ID_BCA":
      label = "BCA";
      break;

    default:
      label = "-";
      break;
  }

  return label;
};

export const getIconMilestone = (position: number) => {
  let icon: any;

  switch (position) {
    case 2:
      icon = FaLeaf;
      break;

    case 3:
      icon = RiTreeFill;
      break;

    case 4:
      icon = FaTree;
      break;

    case 5:
      icon = RiShieldCheckFill;
      break;

    default:
      icon = RiMotorbikeFill;
      break;
  }

  return icon;
};

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

export const convertToReadableHours = (data?: OperationalHour[]) => {
  let value: boolean = false;

  if (data) {
    const isOpenAllWeek =
      data.length === 7 &&
      data.every(
        (item) => item.From === "00:00" && item.To === "23:59" && !item.IsClosed
      );

    if (isOpenAllWeek) return (value = true);
  }

  // fallback (optional): format each day
  return value;
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function getCurrentSlot(
  priceBase: PriceBaseRule | null
): PriceBaseTime | undefined {
  if (!priceBase?.PriceBaseTime?.length) return undefined;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const matchedSlot = priceBase.PriceBaseTime.find((slot) => {
    const fromMinutes = timeToMinutes(slot?.PriceTimeRule?.From);
    const toMinutes = timeToMinutes(slot?.PriceTimeRule?.To);

    if (isNaN(fromMinutes) || isNaN(toMinutes)) return false;

    // Normal same-day range
    if (fromMinutes <= toMinutes) {
      return currentMinutes >= fromMinutes && currentMinutes <= toMinutes;
    }

    // Overnight range
    return currentMinutes >= fromMinutes || currentMinutes <= toMinutes;
  });

  return matchedSlot;
}


export const getLabelWatt = (min: number, max: number) => {
  let value: string = "";

  if (min === max) {
    if (min < 1) value = `${min * 1000}w`;
    else value = `${min}kW`;
  } else {
    value = `${min}-${max}kW`;
  }

  return value;
};