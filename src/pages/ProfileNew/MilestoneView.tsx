import { FaAngleRight } from "react-icons/fa6";
import { NavigateFunction } from "react-router-dom";
import { ProgressSteps, Separator } from "../../components";

interface Props {
  navigate: NavigateFunction;
  dataUser: UserProps | null;
  dataMilestone: Milestone[] | null;
}

const MilestoneView: React.FC<Props> = ({
  navigate,
  dataUser,
  dataMilestone,
}) => {
  let currentStep: number = -1;

  if (dataUser && dataMilestone && dataMilestone?.length) {
    currentStep = dataMilestone?.findIndex(
      (e) => e?.ID === dataUser?.MilestoneID
    );
  }

  return (
    <div className="bg-white shadow px-3 py-[14px] mt-3 mx-4 rounded-lg">
      <div className="between-x">
        <span className="font-medium">Level Ramah Lingkungan</span>

        <div
          onClick={() => navigate("/progress-details")}
          className="row gap-2 cursor-pointer"
        >
          <span className="text-xs text-primary100 font-medium">
            Lihat Reward
          </span>

          <div className="bg-primary10 w-[22px] h-[22px] rounded-full flex justify-center items-center">
            <FaAngleRight size={14} className="text-primary100" />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <ProgressSteps currentStep={currentStep} dataMilestone={dataMilestone} />
    </div>
  );
};

export default MilestoneView;
