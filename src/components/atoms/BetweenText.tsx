import React from "react";

interface BetweenTextProps {
  type?: "medium-content";
  labelLeft: string;
  labelRight: string;
  classNameLabelLeft?: string;
  classNameLabelRight?: string;
  className?: string;
}

const BetweenText: React.FC<BetweenTextProps> = ({
  type,
  labelLeft,
  labelRight,
  className,
  classNameLabelLeft,
  classNameLabelRight,
}) => {
  return (
    <div className={`between text-xs text-black100/80 ${className}`}>
      <p className={classNameLabelLeft}>{labelLeft}</p>
      <p
        className={`${
          type === "medium-content" ? "text-blackBold font-medium" : ""
        } ${classNameLabelRight}`}
      >
        {labelRight}
      </p>
    </div>
  );
};

export default BetweenText;
