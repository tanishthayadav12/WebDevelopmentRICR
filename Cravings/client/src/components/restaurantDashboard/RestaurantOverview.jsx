import React from "react";
import { FaShoppingCart, FaUsers, FaRupeeSign, FaStar } from "react-icons/fa";

const RestaurantOverview = () => {
  const stats = [
    {
      title: "Total Orders",
      value: "0",
      icon: <FaShoppingCart className="text-(--)" />,
      bgColor: "bg-(--)",
    },
    {
      title: "Active Orders",
      value: "0",
      icon: <FaUsers className="text-(--)" />,
      bgColor: "bg-(--)",
    },
    {
      title: "Total Earnings",
      value: "â‚¹0",
      icon: <FaRupeeSign className="text-(--)" />,
      bgColor: "bg-(--)",
    },
    {
      title: "Rating",
      value: "4.5",
      icon: <FaStar className="text-(--)0" />,
      bgColor: "bg-(--color-background)",
    },
  ];

  return (
    <>
      <div className="bg-(--) rounded-lg p-6 h-full overflow-y-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md p-6 border border-(--)"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-(--)/80 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-(--) mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-lg text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-(--)">
          <h2 className="text-xl font-bold text-(--) mb-4">
            Recent Orders
          </h2>
          <div className="text-center text-(--)/70 py-8">
            No recent orders to display
          </div>
        </div>

        {/* Performance Chart Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-(--)">
          <h2 className="text-xl font-bold text-(--) mb-4">
            Weekly Performance
          </h2>
          <div className="text-center text-(--)/70 py-8">
            Performance chart will be displayed here
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantOverview;


