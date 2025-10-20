import React from "react";

const Card = ({ children, className = "", onClick, hover = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${
        hover
          ? "transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer"
          : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
