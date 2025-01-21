import { ILComingSoon, ILComingSoonLabel, ILLogoSlogan } from "../assets";

const ComingSoon = () => {
  return (
    <div className="background-coming-soon flex flex-col justify-between">
      <div className="center mt-[74px]">
        <img
          src={ILLogoSlogan}
          alt="logo"
          className="max-w-[146px] max-h-[64px]"
        />
      </div>

      <div className="flex-1 center flex-col">
        <img
          src={ILComingSoonLabel}
          alt="coming soon"
          className="max-w-[311px] max-h-[153px]"
        />

        <p className="max-w-[311px] text-[13px] text-white text-center">
          Effortless and reliable EV charging solutions for electric motorcycles
          and scooters
        </p>
      </div>

      <div className="center mb-[36px] mx-3">
        <img
          src={ILComingSoon}
          alt="coming soon"
          className="max-w-[366px] max-h-[134px]"
        />
      </div>
    </div>
  );
};

export default ComingSoon;
