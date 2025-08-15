import { getIconMilestone } from "../../helpers";

interface Props {
  currentStep: number;
  dataMilestone: Milestone[] | null;
}

const ProgressSteps: React.FC<Props> = ({ currentStep, dataMilestone }) => {
  return (
    <div className="flex flex-1 items-center justify-center">
      {dataMilestone &&
        dataMilestone.length &&
        dataMilestone.map((step, index) => {
          const isActive: boolean = index <= currentStep;
          const isRightActive: boolean = index - 1 === currentStep;
          const isLast: boolean =
            index === (dataMilestone ? dataMilestone.length : 0) - 1;
          const Icon: any = getIconMilestone(index + 1);

          return (
            <div key={step.ID} className={`flex  ${!isLast && "flex-1"}`}>
              {/* Step */}
              <div className="flex flex-col items-center text-center w-10">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full
                bg-${
                  isActive
                    ? "primary100"
                    : isRightActive
                    ? "primary10"
                    : "black10"
                }`}
                >
                  <Icon
                    size={16}
                    className={`text-${
                      isActive
                        ? "white"
                        : isRightActive
                        ? "primary100"
                        : "black70"
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium mt-1 mb-0.5 text-${
                    isActive
                      ? "primary100"
                      : isRightActive
                      ? "black100"
                      : "black70"
                  }`}
                >
                  {step?.Name}
                </span>
                <span className="text-[10px] text-black70">
                  {step?.MinCO2Saved} Kg
                </span>
              </div>

              {/* Connector */}
              {!isLast && (
                <div
                  className={`flex w-full h-[2px] mx-2 mt-4 border-b border-${
                    isActive
                      ? "primary100"
                      : isRightActive
                      ? "primary100"
                      : "black30"
                  } border-${
                    isActive ? "solid" : "dashed"
                  }`}
                />
              )}
            </div>
          );
        })}
    </div>
  );
};

export default ProgressSteps;
