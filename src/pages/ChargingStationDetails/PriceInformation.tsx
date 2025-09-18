import { useEffect, useState } from "react";
import { Separator, Tabs } from "../../components";
import { moments, rupiah, timeToSeconds } from "../../helpers";

interface PriceInformationProps {
  data: ChargingStation | null;
  isHideParking?: boolean;
}

interface TransformedData {
  id: number;
  title: string;
  content: { watt: string; price: number; isPower: boolean }[];
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

          if (rule?.VehicleType === 1) {
            existingSlot.content.push({
              watt:
                data?.PriceSetting?.BikePriceType === 2
                  ? "Tarif"
                  : isLast
                  ? `>${rule.From - 1}W`
                  : `${rule.From}-${rule.To}W`,
              isPower: data?.PriceSetting?.BikePriceType === 2 ? true : false,
              price:
                data?.PriceSetting?.BikePriceType === 2
                  ? data?.PriceSetting.BikeBaseFare
                  : timeSlot.Value,
            });
          }
        });
      });

      const currentDay: number = Number(moments().format("d"));
      const filterOperationHour: OperationalHour | undefined =
        data?.OperationalHours.filter((e) => e.Day === currentDay)[0];
      let timeFromHour: number | undefined;
      let timeToHour: number | undefined;

      if (filterOperationHour) {
        timeFromHour = timeToSeconds(filterOperationHour?.From);
        timeToHour = timeToSeconds(filterOperationHour?.To);
      }

      const newTab: TabItemProps[] = [];

      if (newData && newData.length) {
        newData.forEach((element) => {
          const splitTitle = element.title.split("-");
          const timeStart = timeToSeconds(splitTitle[0]);
          const timeEnd = timeToSeconds(splitTitle[1]);
          let labelFromTitle: string = splitTitle[0];
          let labelToTitle: string = splitTitle[1];
          let isAdd: boolean = true;

          if (
            timeFromHour !== undefined &&
            timeToHour !== undefined &&
            filterOperationHour
          ) {
            if (timeFromHour > timeStart) {
              labelFromTitle = filterOperationHour?.From;

              if (timeEnd < timeFromHour) isAdd = false;
            }
            if (timeToHour < timeEnd) labelToTitle = filterOperationHour?.To;

            if (isAdd) {
              const newItem: TabItemProps = {
                id: element?.id,
                label: `${labelFromTitle}-${labelToTitle}`,
                content: <PriceInformationTab data={element.content} />,
              };

              newTab.push(newItem);
            }
          }
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
  data: { watt: string; price: number; isPower: boolean }[];
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
                {`${item?.watt}`}
              </span>
              <span className="text-primary100 font-semibold row">
                <a className="text-[10px] mr-1">Rp</a>{" "}
                {`${rupiah(item?.price)}/${item?.isPower ? "kWh" : "jam"}`}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};
