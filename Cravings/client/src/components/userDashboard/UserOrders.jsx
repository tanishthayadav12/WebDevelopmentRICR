import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import toast from "react-hot-toast";
import Loading from "../Loading";

const UserOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState();

  const fetchAllPlacedOrder = async () => {
    setIsLoading(true);
    console.log("Fetching User Placed Orders...");
    try {
      const res = await api.get("/user/placedorders");
      setOrders(res.data.data);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Unknown Error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPlacedOrder();
    const interval = setInterval(() => {
      fetchAllPlacedOrder();
    }, 1000 * 10); // Refresh every 1 minutes
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="bg-(--) rounded-lg p-6 h-full overflow-y-auto">
      <div className="bg-white rounded-lg shadow-md p-6 border border-(--)">
        <h2 className="text-2xl font-bold text-(--) mb-4">My Orders</h2>
        <div className="border mt-3" />

        {!orders || orders.length === 0 ? (
          <div className="text-center text-(--)/70 py-12">
            <p className="text-lg">No orders placed yet</p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-(--) border-b-2 border-(--)">
                  <th className="text-left px-4 py-3 font-semibold text-(--)">
                    Order Number
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-(--)">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-(--)">
                    Total Amount
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-(--)">
                    Items
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-(--)">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-(--)">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-(--) hover:bg-(--) transition"
                  >
                    <td className="px-4 py-3 text-(--) font-medium">
                      {order.orderNumber || order._id?.substring(0, 8)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                          order.status === "completed"
                            ? "bg-(--) text-(--)"
                            : order.status === "cancelled"
                              ? "bg-(--) text-(--)"
                              : order.status === "pending"
                                ? "bg-(--) text-(--)"
                                : "bg-(--) text-(--)"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-(--) font-semibold">
                      â‚¹{order.orderValue.total || 0}
                    </td>
                    <td className="px-4 py-3 text-(--)/80">
                      {order.items?.length || 0} item
                      {order.items?.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3 text-(--)/80">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="ps-4 py-3 text-(--)/80">
                      <button className="bg-(--) hover:bg-(--) text-white px-4 py-2 rounded-md transition">
                        Track Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;


