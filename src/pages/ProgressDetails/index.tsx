import { useEffect } from "react";
import { FaLeaf, FaTree } from "react-icons/fa6";
import { RiMotorbikeFill, RiShieldCheckFill, RiTreeFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Header,
  LoadingPage,
  ProgressSteps,
  Separator,
} from "../../components";
import { fetchMilestoneList, fetchMyUser } from "../../features";
import { getIconMilestone } from "../../helpers";
import { AppDispatch, RootState } from "../../store";
import ProgressBar from "./ProgressBar";

const steps = [
  {
    title: "Eco Explorer",
    description: "0 kg",
    icon: FaLeaf,
  },
  {
    title: "Green Rider",
    description: "50 kg",
    icon: RiMotorbikeFill,
  },
  {
    title: "Forest Friend",
    description: "150 kg",
    icon: RiTreeFill,
  },
  {
    title: "Oxigen Hero",
    description: "500 kg",
    icon: FaTree,
  },
  {
    title: "Planet Protector",
    description: "1000 kg",
    icon: RiShieldCheckFill,
  },
];

const ProgressDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const myUser = useSelector((state: RootState) => state.myUser);
  const milestoneList = useSelector((state: RootState) => state.milestoneList);

  useEffect(() => {
    const getData = () => {
      if (!myUser?.data) dispatch(fetchMyUser());
      if (!milestoneList?.data) dispatch(fetchMilestoneList());
    };

    getData();
  }, []);

  let currentStep: number = -1;
  let max: number = 0;
  let min: number = 0;
  let isFinish: boolean = false;
  let label: string = "";

  if (myUser?.data && milestoneList?.data?.length) {
    currentStep = milestoneList?.data?.findIndex(
      (e) => e?.ID === myUser?.data?.MilestoneID
    );

    max = milestoneList?.data[currentStep]?.MinCO2Saved || 0;
    if (currentStep > 0)
      min = milestoneList?.data[currentStep - 1]?.MinCO2Saved || 0;

    isFinish = currentStep === milestoneList?.data.length - 1;
    label = milestoneList?.data[currentStep]?.Name;
  }

  const Icon = getIconMilestone(currentStep + 1);

  if (!label && milestoneList?.data?.length)
    label = milestoneList?.data[0]?.Name;

  return (
    <div className="background-1 flex flex-col overflow-hidden relative">
      <Header
        className="mx-4 mt-3.5"
        type="secondary"
        title="Detail Progres"
        onDismiss={() => navigate(-1)}
      />

      <LoadingPage loading={myUser?.loading || milestoneList?.loading}>
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <div className="flex-1 overflow-auto">
            {/* ICON */}
            <div className="flex-col center gap-2 p-3 mt-4">
              <div
                className={`rounded-full p-3 shadow ${
                  isFinish
                    ? "bg-gradient-to-b from-white to-[#D79D20]"
                    : "bg-primary30"
                }`}
              >
                <Icon
                  size={36}
                  className={`text-${isFinish ? "[#D79D20]" : "primary100"}`}
                />
              </div>
              <span className="text-blackBold text-lg font-semibold mt-3">
                {label}
              </span>
            </div>

            <div className="mx-4 mb-4 py-4 px-2.5 rounded-lg bg-white">
              <span className="text-xs mb-2">CO₂ Terhemat</span>

              <ProgressBar
                min={min}
                max={max}
                value={myUser?.data?.Milestone?.MinCO2Saved || 0}
              />

              <Separator className="my-4" />

              <ProgressSteps
                currentStep={currentStep}
                dataMilestone={milestoneList?.data}
              />
            </div>

            <div className="flex-1 bg-white py-6 px-4">
              <span className="font-medium text-blackBold mb-8">
                Informasi Reward
              </span>

              {milestoneList?.data &&
                milestoneList?.data?.length &&
                milestoneList?.data.map((item, index) => (
                  <RewardItem key={index} data={item} position={index} />
                ))}
            </div>
          </div>

          <div className="bg-white rounded-t-2xl px-4 py-6">
            <Button
              buttonType="lg"
              label={isFinish ? "Mulai Charging" : "Lihat Stasiun Pengecasan"}
              loading={false}
              onClick={() => {}}
            />
          </div>
        </div>
      </LoadingPage>
    </div>
  );
};

export default ProgressDetails;

interface RewardItemProps {
  data: Milestone;
  position: number;
}

const RewardItem: React.FC<RewardItemProps> = ({ data, position }) => {
  const Icon = getIconMilestone(position + 1);
  let label: string = "Tidak ada discount";

  if (data?.DiscountPercent) label = `Discount ${data?.DiscountPercent}%`;

  return (
    <div className="row gap-3 mb-5">
      <div
        className="flex items-center justify-center w-8 h-8 rounded-full
                bg-primary30"
      >
        <Icon size={16} className="text-primary100" />
      </div>

      <div className="flex flex-col">
        <span className="text-blackBold font-medium">{data?.Name}</span>
        <span className="text-xs text-black70">{label}</span>
      </div>
    </div>
  );
};
