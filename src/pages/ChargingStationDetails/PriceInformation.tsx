import { useEffect, useState } from "react";
import {
  ChargingStation,
  TabItemProps
} from "../../common";
import { Separator, Tabs } from "../../components";
import { rupiah } from "../../helpers";

interface PriceInformationProps {
  data: ChargingStation | undefined;
  isHideParking?: boolean;
}

interface TransformedData {
  id: number;
  title: string;
  content: { watt: string; price: number }[];
}

const PriceInformation: React.FC<PriceInformationProps> = ({
  data,
  isHideParking,
}) => {
  const [tabItem, setTabItem] = useState<TabItemProps[]>();

  useEffect(() => {
    if (
      data?.PriceSetting?.PriceBaseRules &&
      data?.PriceSetting?.PriceBaseRules.length
    ) {
      const newData: TransformedData[] = [];

      data?.PriceSetting?.PriceBaseRules.forEach((rule, index) => {
        const isLast: boolean =
          index === data?.PriceSetting?.PriceBaseRules.length - 1;

        rule.PriceBaseTime.forEach((timeSlot) => {
          // Find if the time slot already exists in newData
          let existingSlot = newData.find(
            (item) => item.id === timeSlot.PriceTimeRule.ID
          );

          if (!existingSlot) {
            existingSlot = {
              id: timeSlot.PriceTimeRule.ID,
              title: `${timeSlot.PriceTimeRule.From}-${timeSlot.PriceTimeRule.To}`,
              content: [],
            };
            newData.push(existingSlot);
          }

          existingSlot.content.push({
            watt: isLast ? `>${rule.From - 1}` : `${rule.From}-${rule.To}`,
            price: timeSlot.Value,
          });
        });
      });

      const newTab: TabItemProps[] = [];
      if (newData && newData.length) {
        newData.forEach((element) => {
          const newItem: TabItemProps = {
            id: element?.id,
            label: element?.title,
            content: <PriceInformationTab data={element.content} />,
          };

          newTab.push(newItem);
        });
      }

      setTabItem(newTab);
    }
  }, [data]);

  if (!data || !tabItem || !tabItem.length) return null;

  return (
    <div className="rounded-lg p-3 bg-white drop-shadow">
      <p className="font-medium mb-1">Informasi Biaya</p>

      <Tabs type="flex" tabs={tabItem} />

      {!isHideParking && (
        <>
          <p className="font-medium mt-3 mb-2">Biaya Parkir</p>
          <p className="text-xs text-black90">Gratis Parkir</p>
        </>
      )}
    </div>
  );
};

export default PriceInformation;

interface PriceInformationTabProps {
  data: { watt: string; price: number }[];
}

const PriceInformationTab: React.FC<PriceInformationTabProps> = ({ data }) => {
  return (
    <div className="bg-primary10 rounded-lg p-3">
      {data &&
        data.length &&
        data.map((item, index) => (
          <div key={index}>
            {index > 0 && <Separator className="bg-primary30 my-2.5" />}

            <div className="between-x">
              <span className="text-xs font-medium text-primary100">
                {`${item?.watt}W`}
              </span>
              <span className="text-primary100 font-semibold row">
                <a className="text-[10px] mr-1">Rp</a>{" "}
                {`${rupiah(item?.price)}/jam`}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};
