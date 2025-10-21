import React from "react";

interface BetweenTextProps {
  type?: "medium-content";
  labelLeft: string;
  labelRight: string | number;
  content?: any;
  labelAdjustment?: string;
  classNameLabelLeft?: string;
  classNameLabelRight?: string;
  className?: string;
}

const BetweenText: React.FC<BetweenTextProps> = ({
  type,
  labelLeft,
  labelRight,
  labelAdjustment,
  className,
  classNameLabelLeft,
  classNameLabelRight,
  content,
}) => {
  const isShowContent: boolean = content ? true : false;
  const isShowAdjustment: boolean = labelAdjustment ? true : false;

  return (
    <div className={`between-x text-xs text-black100/80 ${className}`}>
      <p className={`text-xs text-black70 ${classNameLabelLeft}`}>
        {labelLeft}
      </p>
      {isShowContent ? (
        content
      ) : (
        <div className="row gap-2">
          {isShowAdjustment && (
            <p className="text-black70 text-xs font-medium line-through">
              {labelAdjustment}
            </p>
          )}
          <p
            className={`text-black100 text-xs ${
              type === "medium-content" ? "text-blackBold font-medium" : ""
            } ${classNameLabelRight}`}
          >
            {labelRight}
          </p>
        </div>
      )}
    </div>
  );
};

export default BetweenText;
