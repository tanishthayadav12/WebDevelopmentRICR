import React, { useState } from "react";
import CountryData from "../src/assets/CountryData.json";

const Currency = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  console.log(CountryData);
  return (
    <>
      <div className="bg-amber-100 h-screen p-5">
        <div className="w-3xl bg-white rounded shadow border p-3 mx-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex gap-2 border rounded p-2">
              {from && (
                <img
                  src={`https://flagsapi.com/${from.split(" ")[1]}/flat/64.png`}
                  alt=""
                />
              )}
              <select
                name="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="border p-3 overflow-hidden w-full rounded focus:outline-none"
              >
                <option>--Select Country--</option>
                {CountryData.map((country, idx) => (
                  <option
                    value={country.currencyCode + " " + country.countryCode}
                    key={idx}
                  >
                    {country.countryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 border rounded p-2">
              {from && (
                <img
                  src={`https://flagsapi.com/${to.split(" ")[1]}/flat/64.png`}
                  alt=""
                />
              )}
              <select
                name="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="border p-3 overflow-hidden w-full focus:outline-none rounded"
              >
                <option value="">--Select Country--</option>
                {CountryData.map((country, idx) => (
                  <option
                    value={country.currencyCode + " " + country.countryCode}
                    key={idx}
                  >
                    {country.countryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <div className="">
              <label htmlFor="amount">Amount:</label>
            </div>
            <div className="">
              <input type="number" className="border border-black w-2xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Currency;
