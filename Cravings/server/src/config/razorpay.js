import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();

const razorpayKeyId = process.env.RAZORPAY_TEST_API_KEY;
const razorpayKeySecret = process.env.RAZORPAY_TEST_API_SECRET;

export const isRazorpayConfigured = Boolean(
  razorpayKeyId && razorpayKeySecret,
);

const razorpay = isRazorpayConfigured
  ? new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })
  : null;

export const verifyRazorPayConnect = async () => {
  if (!razorpay) {
    throw new Error("Razorpay credentials are missing in environment variables");
  }

  const orders = await razorpay.orders.all({ count: 1 });
  return orders;
};

export default razorpay;
