import React from "react";
import { HiCurrencyRupee } from "react-icons/hi";
import { HiMiniCurrencyDollar } from "react-icons/hi2";

const Header = () => {
  return (
    <>
      <div className="bg-emerald-500 px-2 py-2 text-black font-bold text-3xl ">
        <span className="flex justify-center">
          <HiCurrencyRupee className="animate-ping" />
          <HiMiniCurrencyDollar className="animate-bounce" />
          Currency Convertor
          <HiCurrencyRupee className="animate-pulse" />
          <HiMiniCurrencyDollar className="animate-spin" />
        </span>
      </div>
    </>
  );
};

export default Header;
