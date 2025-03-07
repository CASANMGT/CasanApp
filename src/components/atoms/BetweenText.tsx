import React from "react";

interface BetweenTextProps {
  type?: "medium-content";
  labelLeft: string;
  labelRight: string | number;
  content?: any;
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
  content,
}) => {
  const isShowContent: boolean = content ? true : false;

  return (
    <div className={`between-x text-xs text-black100/80 ${className}`}>
      <p className={classNameLabelLeft}>{labelLeft}</p>
      {isShowContent ? (
        <>{content}</>
      ) : (
        <p
          className={`${
            type === "medium-content" ? "text-blackBold font-medium" : ""
          } ${classNameLabelRight}`}
        >
          {labelRight}
        </p>
      )}
    </div>
  );
};

export default BetweenText;
