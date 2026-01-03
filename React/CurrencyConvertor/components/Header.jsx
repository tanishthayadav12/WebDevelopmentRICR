import React from "react";
import { HiCurrencyRupee } from "react-icons/hi";
import { HiMiniCurrencyDollar } from "react-icons/hi2";

const Header = () => {
  return (
    <div
      className="px-2 py-2 font-bold text-3xl"
      style={{ backgroundColor: "#1581BF" }}
    >
      <span
        className="flex justify-center items-center gap-2"
        style={{ color: "#FFFFFF" }}
      >
        <HiCurrencyRupee
          className="animate-ping"
          style={{ color: "#3DB6B1" }}
        />
        <HiMiniCurrencyDollar
          className="animate-bounce"
          style={{ color: "#3DB6B1" }}
        />

        <span>Currency Converter</span>

        <HiCurrencyRupee
          className="animate-pulse"
          style={{ color: "#3DB6B1" }}
        />
        <HiMiniCurrencyDollar
          className="animate-spin"
          style={{ color: "#3DB6B1" }}
        />
      </span>
    </div>
  );
};

export default Header;
