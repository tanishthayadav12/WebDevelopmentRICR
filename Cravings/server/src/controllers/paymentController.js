import razorpay, { isRazorpayConfigured } from "../config/razorpay.js";
import crypto from "crypto";

export const RazorpayGetKey = async (req, res, next) => {
  try {
    if (!isRazorpayConfigured) {
      return res.status(503).json({ message: "Razorpay is not configured" });
    }

    res.status(200).json({ key: process.env.RAZORPAY_TEST_API_KEY });
  } catch (error) {
    next(error);
  }
};

export const RazorPayCreateOrder = async (req, res, next) => {
  try {
    if (!isRazorpayConfigured || !razorpay) {
      return res.status(503).json({ message: "Razorpay is not configured" });
    }

    const { amount } = req.body;

    if (!amount) {
      const error = new Error("Invalid Amount");
      error.statusCode = 400;
      return next(error);
    }

    const Total = Number(amount);
    const RazorPayOptions = {
      amount: Math.round(Total * 100),
      currency: "INR",
      receipt: `CravingReciept_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
    };

    console.log(RazorPayOptions);

    const order = await razorpay.orders.create(RazorPayOptions);

    console.log("Data from RazorPay", order);

    res.status(200).json({ message: "Redirecting for Payment", data: order });
  } catch (error) {
    next(error);
  }
};

export const RazorPayVerifyPayment = async (req, res, next) => {
  try {
    if (!process.env.RAZORPAY_TEST_API_SECRET) {
      return res.status(503).json({ message: "Razorpay is not configured" });
    }

    const { paymentID, orderID, signature } = req.body;

    console.log({ paymentID, orderID, signature });

    if (!paymentID || !orderID || !signature) {
      const error = new Error("Invalid Payment Details");
      error.statusCode = 400;
      return next(error);
    }

    const orderString = orderID + "|" + paymentID;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_TEST_API_SECRET)
      .update(orderString.toString())
      .digest("hex");

    console.log(generatedSignature);

    if (generatedSignature !== signature) {
      const error = new Error("Payment Verification Failed");
      error.statusCode = 400;
      return next(error);
    }

    res.status(200).json({ message: "Payment Verified Successfully" });

  } catch (error) {
    next(error);
  }
};
