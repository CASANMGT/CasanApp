import { IcCustomerServiceBlack } from "../../assets";
import { CUSTOMER_SERVICES } from "../../common";
import { Button, Separator } from "../../components";

const BasicInformation = () => {
  return (
    <div className="rounded-lg p-3 bg-white drop-shadow mt-3">
      <p className="font-medium mb-1">Informasi Dasar</p>

      <p className="text-xs text-black90 mb-1">Jam Operasional:</p>
      <div className="w-2/4 text-xs font-semibold space-y-1">
        <div className="between-x">
          <p className="flex-1">Senin - Kamis</p>
          <p className="flex-1">07:00 - 22:00 WIB</p>
        </div>

        <div className="between-x">
          <p className="flex-1">Jumat</p>
          <p className="text-red flex-1">Libur</p>
        </div>

        <div className="between-x">
          <p className="flex-1">Sabtu - Minggu</p>
          <p className="flex-1">07:00 - 13:00 WIB</p>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="between-x">
        <div className="row gap-2">
          <IcCustomerServiceBlack />
          <span className="font-medium">{CUSTOMER_SERVICES}</span>
        </div>

        <div>
          <Button
            type="light-green"
            buttonType="sm"
            label="Contact Us ->"
            onClick={() => alert("coming soon")}
            // className="!h-[24px] text-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
