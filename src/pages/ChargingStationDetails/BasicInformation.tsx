import { IcCustomerServiceBlack } from "../../assets";
import { CUSTOMER_SERVICES, DaysOfWeek, OperationalHour } from "../../common";
import { Button, Separator } from "../../components";

interface BasicInformationProps {
  data: OperationalHour[];
}

const BasicInformation: React.FC<BasicInformationProps> = ({ data }) => {
  return (
    <div className="rounded-lg p-3 bg-white drop-shadow mt-3">
      <p className="font-medium mb-1">Informasi Dasar</p>

      <p className="text-xs text-black90 mb-1">Jam Operasional:</p>
      <div className="w-3/4 text-xs font-semibold space-y-1">
        {data.map((item, index) => (
          <div key={index} className="between-x py-0.5">
            <p className="flex-1">{DaysOfWeek[item?.Day || 0]}</p>
            <p className="flex-1">{`${item?.From} - ${item?.To} WIB`}</p>
          </div>
        ))}
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
