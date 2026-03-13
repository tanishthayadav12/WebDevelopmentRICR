import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaTruck,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import toast from "react-hot-toast";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state;

  useEffect(() => {
    if (!order) {
      toast.error("Order not found. Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [order, navigate]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-text/80 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <FaCheckCircle
              className="text-6xl mx-auto text-secondary"
            />
          </div>
          <h1
            className="text-3xl font-bold mb-2 text-primary"
          >
            Order Placed!
          </h1>
          <p className="text-text/80">
            Your order has been successfully placed. Thank you for choosing
            Cravings!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2">
            {/* Order Details Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-(--) mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p
                    className="text-2xl font-bold text-primary"
                  >
                    {order.orderNumber}
                  </p>
                </div>
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-secondary text-white">
                  Paid
                </span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <p className="text-text/80 text-sm">Order Date & Time</p>
                <p className="text-text font-semibold">
                  {new Date(order.createdAt).toLocaleDateString()} at{" "}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Order Items Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
              <h2
                className="text-xl font-bold mb-4 text-primary"
              >
                Order Items
              </h2>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b pb-3"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-text">
                          {item.itemName}
                        </p>
                        <p className="text-sm text-text/70">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <p className="font-semibold text-text">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-text/70">No items in order</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-1">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <FaMapMarkerAlt
                  className="text-xl shrink-0 mt-1 text-secondary"
                />
                <h3
                  className="font-bold text-primary"
                >
                  Delivery Address
                </h3>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-text">
                  {order.userId?.fullName}
                </p>
                <p className="text-sm text-text/80">{order.userId?.address}</p>
                <p className="text-sm text-text/80">
                  {order.userId?.city}, {order.userId?.pin}
                </p>
                <p className="text-sm text-text/80">
                  📞 {order.userId?.mobileNumber}
                </p>
              </div>
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-4">
              <h2
                className="text-xl font-bold mb-4 text-primary"
              >
                Price Breakdown
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-(--)">Subtotal</span>
                  <span className="font-semibold text-(--)">
                    â‚¹{order.orderValue?.subtotal?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--)">Tax (5%)</span>
                  <span className="font-semibold text-(--)">
                    â‚¹{order.orderValue?.tax?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-(--)">Delivery Charge</span>
                  <span className="font-semibold text-(--)">
                    â‚¹{order.orderValue?.deliveryFee?.toFixed(2)}
                  </span>
                </div>
                {order.orderValue?.discountPercentage > 0 && (
                  <div className="flex justify-between text-(--)">
                    <span>
                      Discount ({order.orderValue.discountPercentage}%)
                    </span>
                    <span>
                      -â‚¹
                      {(
                        (order.orderValue.subtotal *
                          order.orderValue.discountPercentage) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span
                    className="text-lg font-bold text-primary"
                  >
                    Total Amount
                  </span>
                  <span
                    className="text-2xl font-bold text-secondary"
                  >
                    ₹{order.orderValue?.total?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <button
              onClick={() =>
                navigate("/user-dashboard", { state: { tab: "orders" } })
              }
              className="text-white w-full font-bold py-3 rounded-lg hover:opacity-90 transition bg-primary"
            >
              Track Order
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <button
            onClick={() => navigate("/order-now")}
            className="border-2 font-bold py-3 rounded-lg hover:bg-secondary transition text-secondary border-secondary"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-white font-bold py-3 rounded-lg hover:opacity-90 transition bg-secondary"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;


