import React from "react";

const ICONS = {
  Curl: (
    <svg
      className="absolute -bottom-1 left-0 w-full"
      viewBox="0 0 180 10"
      fill="none"
    >
      <path
        d="M2 7 Q45 2 90 6 Q135 10 178 4"
        stroke="#1a3cff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />
    </svg>
  ),
};
type IconProps = {
  name: keyof typeof ICONS;
  className?: string;
};

const Icon = ({ name, className }: IconProps) => {
  if (!ICONS[name]) {
    return null;
  } else if (className) {
    return React.cloneElement(ICONS[name], { className });
  } else {
    return ICONS[name];
  }
};

export default Icon;
