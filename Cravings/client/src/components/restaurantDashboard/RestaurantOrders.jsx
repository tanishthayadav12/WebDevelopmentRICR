import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import toast from "react-hot-toast";
import Loading from "../Loading";
import ViewReceivedOrder from "./modals/ViewReceivedOrder";

const RestaurantOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState();
  const [refresh, setRefresh] = useState(true);
  const [isViewingOrder, setIsViewingOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchPlacedOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/restaurant/placedOrders");
      setOrders(res.data.data);
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to fetch orders");
    } finally {
      setIsLoading(false);
      setRefresh(false);
    }
  };

  useEffect(() => {
    console.log("Fetching Placed Orders...");
    console.log({ refresh, isViewingOrder });

    if (refresh || !isViewingOrder) {
      fetchPlacedOrders();
    }
  }, [refresh, isViewingOrder]);

  if (isLoading) {
    return (
      <div className="w-full">
        <Loading />
      </div>
    );
  }

  // console.log(orders);

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-6 h-full overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Orders</h2>
            <button
              onClick={() => setRefresh(!refresh)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Refresh Orders
            </button>
          </div>
          <div className="border mt-3" />

          {!orders || orders.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg">No orders placed yet</p>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      Order Number
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      Total Amount
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      Items
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 text-gray-800 font-medium">
                        {order.orderNumber || order._id?.substring(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {order.userId?.fullName || "Unknown"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-semibold">
                        ₹{order.orderValue.total || 0}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {order.items?.length || 0} item
                        {order.items?.length !== 1 ? "s" : ""}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="ps-4 py-3 text-gray-600">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsViewingOrder(true);
                          }}
                        >
                          View Details
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

      {isViewingOrder && selectedOrder && (
        <ViewReceivedOrder
          order={selectedOrder}
          onClose={() => setIsViewingOrder(false)}
        />
      )}
    </>
  );
};

export default RestaurantOrders;