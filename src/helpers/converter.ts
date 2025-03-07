import {
  IcAstraPay,
  IcDana,
  IcGopay,
  IcLinkAja,
  IcNoImage,
  IcOvo,
  IcQris,
  IcShopeePay,
  IcWallet,
} from "../assets";
import { ASTRAPAY, DANA, GOPAY, LINK_AJA, OVO, QRIS, SHOPEEPAY } from "../common";

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

    case SHOPEEPAY:
      label = "Shopeepay";
      break;

    case LINK_AJA:
      label = "Link Aja";
      break;

    case ASTRAPAY:
      label = "AstraPay";
      break;

    default:
      label = "Saldo";
      break;
  }

  return label;
};
