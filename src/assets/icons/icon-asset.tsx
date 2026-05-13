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
  previous: (
    <svg
      width="8"
      height="10"
      viewBox="0 0 8 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.81055 9.82812L7.01758 8.62109L3.39648 5L7.01758 1.37891L5.81055 0.171875L0.982422 5L5.81055 9.82812Z"
        fill="#3D3D3D"
      />
    </svg>
  ),
  next: (
    <svg
      width="8"
      height="10"
      viewBox="0 0 8 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.18945 0.171875L0.982422 1.37891L4.60352 5L0.982422 8.62109L2.18945 9.82812L7.01758 5L2.18945 0.171875Z"
        fill="#3D3D3D"
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
