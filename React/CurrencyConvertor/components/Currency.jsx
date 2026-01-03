import React, { useState } from "react";
import CountryData from "../src/assets/CountryData.json";
import toast from "react-hot-toast";
import axios from "axios";
import { AiOutlineSwap } from "react-icons/ai";

const Currency = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromAmt, setFromAmt] = useState("");
  const [toAmt, setToAmt] = useState("");
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);

  const swap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);

    if (fromAmt) {
      setTimeout(Convert, 0);
    }
  };

  const Convert = async () => {
    if (!from || !to || !fromAmt) {
      toast.error("Some fields are missing");
      return;
    }

    if (fromAmt <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    const fromCode = from.split(" ")[0].toLowerCase();
    const toCode = to.split(" ")[0].toLowerCase();

    if (fromCode === toCode) {
      toast.error("Both currencies are same");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCode}.json`
      );

      const exchangeRate = res.data[fromCode][toCode];
      setRate(exchangeRate);

      setToAmt((fromAmt * exchangeRate).toFixed(2));
      setLoading(false);
    } catch (error) {
      toast.error("Conversion failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen p-5" style={{ backgroundColor: "#F6B1CE" }}>
      <div
        className="max-w-3xl rounded shadow border p-5 mx-auto space-y-5"
        style={{ backgroundColor: "#CCE5CF" }}
      >
        <div className="relative grid grid-cols-2 gap-10">
          <div
            className="flex gap-2 rounded px-3 items-center border"
            style={{ borderColor: "#3DB6B1" }}
          >
            {from && (
              <img
                src={`https://flagsapi.com/${from.split(" ")[1]}/flat/48.png`}
                alt=""
              />
            )}
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="p-3 w-full focus:outline-none"
            >
              <option value="">-Select Country-</option>
              {CountryData.map((country, idx) => (
                <option
                  key={idx}
                  value={`${country.currencyCode} ${country.countryCode}`}
                >
                  {country.countryName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 border rounded px-3 items-center">
            {to && (
              <img
                src={`https://flagsapi.com/${to.split(" ")[1]}/flat/48.png`}
                alt=""
              />
            )}
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="p-3 w-full focus:outline-none"
            >
              <option value="">-Select Country-</option>
              {CountryData.map((country, idx) => (
                <option
                  key={idx}
                  value={`${country.currencyCode} ${country.countryCode}`}
                >
                  {country.countryName}
                </option>
              ))}
            </select>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 top-4">
            <button
              onClick={swap}
              className="text-2xl hover:scale-150 duration-300"
              style={{ color: "#1581BF" }}
            >
              <AiOutlineSwap />
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="flex gap-3 items-center">
          <label>Amount</label>
          <input
            type="number"
            value={fromAmt}
            onChange={(e) => setFromAmt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && Convert()}
            placeholder="Enter amount"
            className="rounded p-3 w-full border"
            style={{ borderColor: "#3DB6B1" }}
          />
        </div>

        <button
          disabled={loading || !from || !to || !fromAmt}
          onClick={Convert}
          className="px-4 py-2 rounded w-full transition font-semibold"
          style={{
            backgroundColor: loading ? "#CCE5CF" : "#1581BF",
            color: "white",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Converting..." : "Convert"}
        </button>

        <div className="border" />

        <div className="space-y-2">
          <p className="font-semibold" style={{ color: "#1581BF" }}>
            Converted Amount : {toAmt !== "" ? toAmt : "XXXXXX"}
          </p>

          {rate && (
            <p className="text-sm" style={{ color: "#3DB6B1" }}>
              1 {from.split(" ")[0]} = {rate} {to.split(" ")[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Currency;
