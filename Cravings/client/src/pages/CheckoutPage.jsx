import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import api from "../config/Api";
import logo from "../assets/circleLogo.png";

const PromoCode = {
  NEW50: 50,
  SAVE20: 20,
  CRAVE10: 10,
};

const AvailablePaymentMethod = [
  { id: "razorPay", label: "Pay Online" },
  { id: "cod", label: "Cash on Delivery" },
];
const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")));
  const [paymentMethod, setPaymentMethod] = useState("razorPay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending");

  // Tax and charges calculation
  const TAX_RATE = 0.05; // 5% tax
  const DELIVERY_CHARGE = 50;

  useEffect(() => {
    if (!user || !cart || cart.cartItem.length === 0) {
      toast.error("Cart is empty or session expired");
      navigate("/order-now");
    }
  }, []);

  const handleQuantityChange = (itemId, change) => {
    setCart((prev) => {
      const updatedItems = prev.cartItem.map((item) => {
        if (item._id === itemId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      return { ...prev, cartItem: updatedItems, cartValue: newTotal };
    });
  };

  const handleRemoveItem = (itemId) => {
    setCart((prev) => {
      const itemToRemove = prev.cartItem.find((item) => item._id === itemId);
      const newTotal =
        prev.cartValue - itemToRemove.price * itemToRemove.quantity;
      const updatedItems = prev.cartItem.filter((item) => item._id !== itemId);

      if (updatedItems.length === 0) {
        toast.error("Cart is now empty!");
        navigate("/order-now");
        return prev;
      }

      return { ...prev, cartItem: updatedItems, cartValue: newTotal };
    });
  };

  const calculatePrices = () => {
    const subtotal = cart?.cartValue || 0;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + DELIVERY_CHARGE;
    return { subtotal, tax, total };
  };

  const handlePromoCodeApply = () => {
    const discountPercent = PromoCode[promoCode.toUpperCase()];
    if (discountPercent) {
      const { subtotal } = calculatePrices();
      const discountAmount = (subtotal * discountPercent) / 100;
      const newSubTotal = subtotal - discountAmount;

      console.log("Applying promo code:", {
        promoCode,
        discountPercent,
        discountAmount,
        oldSubTotal: subtotal,
        newSubTotal: newSubTotal,
      });
      setCart((prev) => ({
        ...prev,
        cartValue: newSubTotal,
      }));
      toast.success(
        `Promo code applied! You saved â‚¹${discountAmount.toFixed(2)}`,
      );
      setAppliedPromo(true);
    } else {
      toast.error("Invalid promo code");
    }
  };

  const GeneratePayload = (RazorpayOrderID, RazorpayPaymentID) => {
    const { subtotal, tax, total } = calculatePrices();
    return {
      restaurantId: cart.resturantID,
      userId: user._id,
      items: [...cart.cartItem],
      orderValue: {
        subtotal,
        tax,
        total,
        promoCode,
        deliveryFee: 50,
        discountPercentage: PromoCode[promoCode.toUpperCase()],
        paymentMethod: "razorPay",
        paymentStatus: "paid",
        razorpayOrderID: RazorpayOrderID,
        razorpayPaymentID: RazorpayPaymentID,
      },
      status: "pending",
      review: {},
    };
  };

  const handleRazorpayPayment = async () => {
    const { total } = calculatePrices();
    try {
      const keyRes = await api.get("/payment/getRazorpayKey");
      const key = keyRes.data.key;

      const orderRes = await api.post("/payment/createOrder", {
        amount: total,
      });

      const orderdata = orderRes.data.data;

      console.log(orderdata);

      const option = {
        key,
        amount: String(orderdata.amount),
        currency: orderdata.currency,
        name: "Cravings", //your business name
        description: "Test Transaction",
        image: "https://placehold.co/600x400?text=CR",
        order_id: orderdata.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        //this will run on Payment Success
        handler: async (response) => {
          try {
            console.log(response);

            const VerifyPaymentPayload = {
              paymentID: response.razorpay_payment_id,
              orderID: response.razorpay_order_id,
              signature: response.razorpay_signature,
            };

            console.log(VerifyPaymentPayload);
            const res = await api.post(
              "/payment/verifyPayment",
              VerifyPaymentPayload,
            );

            //placeorder
            const payload = GeneratePayload(
              response.razorpay_order_id,
              response.razorpay_payment_id,
            );

            const OrderRes = await api.post("/user/placeorder", payload);
            navigate("/paymentSuccess", {state:OrderRes.data.data});
          } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Unknown Error");
          } finally {
            setIsProcessing(false);
          }
        },
        //this will run on closing the RazorPay Modal
        modal: {
          ondismiss: () => {
            toast.error("Please Complete your Payment to Proceed");
            setIsProcessing(false);
          },
        },
        prefill: {
          name: user.fullName, //your customer's name
          email: user.email,
          contact: user.mobileNumber, //Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "var(--color-primary)",
        },
      };

      console.log(option);

      const razorpay = new window.Razorpay(option);
      razorpay.open();

      razorpay.on("payment.failed", (response) => {
        console.log("Payment Failed");
        toast.error("Payment Failed");
      });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Unknown Error");
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !cart) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    console.log("Lets Start Payment");

    if (paymentMethod === "razorPay") {
      console.log("Calling RazorPay");
      handleRazorpayPayment();
    }
  };

  if (!user || !cart) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-text/80">Loading...</div>
      </div>
    );
  }

  const { subtotal, tax, total } = calculatePrices();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold text-primary"
          >
            Order Checkout
          </h1>
          <p className="text-text/80 mt-2">
            Review your order and complete the payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Order Items */}
          <div className="lg:col-span-2">
            {/* Order Items Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2
                className="text-2xl font-bold mb-6 text-primary"
              >
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4">
                {cart.cartItem && cart.cartItem.length > 0 ? (
                  cart.cartItem.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 border-b pb-4 hover:bg-(--) p-3 rounded transition"
                    >
                      {/* Item Image */}
                      <div className="shrink-0">
                        <img
                          src={item.images?.[0]?.url || "ðŸ”"}
                          alt={item.itemName}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3
                          className="text-lg font-bold text-primary"
                        >
                          {item.itemName}
                        </h3>
                        <p className="text-sm text-text/80 mt-1">
                          {item.cuisine} • {item.type}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs bg-secondary text-white px-2 py-1 rounded">
                            {item.servingSize}
                          </span>
                          <span className="text-xs bg-accent text-white px-2 py-1 rounded">
                            {item.preparationTime}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-text mt-2">
                          ₹{item.price}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-accent hover:text-primary transition p-2"
                          title="Remove item"
                        >
                          <FaTrash />
                        </button>

                        <div
                          className="flex items-center border border-(--color-secondary) rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => handleQuantityChange(item._id, -1)}
                            className={`p-2 hover:bg-(--) transition ${item.quantity === 1 ? "bg-(--color-surface-muted)" : "bg-(--color-surface)"}`}
                            disabled={item.quantity === 1}
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="px-4 font-bold text-lg w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item._id, 1)}
                            className="p-2 hover:bg-(--) transition"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right mt-2">
                          <p className="text-sm text-text/80">Subtotal</p>
                          <p
                            className="text-lg font-bold text-secondary"
                          >
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-text/80 text-lg">Your cart is empty</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2
                className="text-2xl font-bold mb-6 text-primary"
              >
                Delivery Address
              </h2>

              <div className="bg-background border-l-4 border-primary p-4 rounded">
                <p
                  className="font-bold text-lg text-primary"
                >
                  {user.fullName}
                </p>
                <p className="text-text mt-2">{user.address}</p>
                <p className="text-text">
                  {user.city}, {user.pin}
                </p>
                <p className="text-text mt-2">📞 {user.mobileNumber}</p>
              </div>

              <button
                onClick={() =>
                  navigate("/user-dashboard", { state: { tab: "profile" } })
                }
                className="mt-4 px-4 py-2 text-primary hover:text-secondary font-semibold transition"
              >
                ✎ Edit Address
              </button>
            </div>
          </div>

          {/* Right Section - Price Summary & Payment */}
          <div className="lg:col-span-1">
            {/* Price Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2
                className="text-xl font-bold mb-6 text-primary"
              >
                Price Details
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-text">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text">Tax (5%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text">Delivery Charge</span>
                  <span className="font-semibold">
                    ₹{DELIVERY_CHARGE.toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-4 flex justify-between">
                  <span
                    className="text-lg font-bold text-primary"
                  >
                    Total Amount
                  </span>
                  <span
                    className="text-2xl font-bold text-secondary"
                  >
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3
                  className="font-bold mb-3 text-primary"
                >
                  Promo Code
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    name="promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 border border-(--color-secondary) rounded px-3 py-2 focus:outline-none disabled:bg-(--)"
                    disabled={appliedPromo}
                  />
                  <button
                    className="text-white px-4 py-2 rounded hover:opacity-90 transition disabled:opacity-50 bg-(--color-secondary)"
                    onClick={handlePromoCodeApply}
                    disabled={appliedPromo}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6 border-t pt-6 mt-6">
                <h3
                  className="font-bold mb-4 text-primary"
                >
                  Payment Method
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="razorPay"
                      checked={paymentMethod === "razorPay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-text">{"Pay Online"}</span>
                  </label>
                  {/* {total < 1000 && (
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 text-(--)">
                        {"Cash on Delivery"}
                      </span>
                    </label>
                  )} */}
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full text-white font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 bg-(--color-secondary)"
              >
                {isProcessing ? "Processing..." : "Place Order"}
              </button>

              {/* Continue Shopping Link */}
              <button
                onClick={() => navigate(-1)}
                className="w-full mt-3 text-(--) font-semibold py-2 rounded-lg hover:text-(--) transition"
              >
                â† Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;


