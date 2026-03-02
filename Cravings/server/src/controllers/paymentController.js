import Order from "../models/orderModel.js";
import Razorpay from "razorpay";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get payment details for an order
export const GetPaymentDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId).select("paymentDetails");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Verify authorization
    const fullOrder = await Order.findById(orderId);
    if (fullOrder.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Not authorized to view payment details",
      });
    }

    return res.status(200).json({
      message: "Payment details retrieved successfully",
      paymentDetails: order.paymentDetails,
    });
  } catch (error) {
    next(error);
  }
};

// Process refund
export const ProcessRefund = async (req, res, next) => {
  try {
    const { orderId, refundAmount } = req.body;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Verify authorization
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Not authorized to refund this order",
      });
    }

    // Check if refund is possible
    if (order.paymentDetails.status !== "completed") {
      return res.status(400).json({
        message: "Cannot refund an order that was not paid",
      });
    }

    if (order.orderStatus !== "cancelled") {
      return res.status(400).json({
        message: "Order must be cancelled before refunding",
      });
    }

    // Process Razorpay refund if applicable
    if (
      order.paymentDetails.method === "razorpay" &&
      order.paymentDetails.razorpayPaymentId
    ) {
      try {
        const refund = await razorpay.payments.refund(
          order.paymentDetails.razorpayPaymentId,
          {
            amount: Math.round(refundAmount * 100), // Convert to paise
          }
        );

        order.refundAmount = refundAmount;
        order.paymentDetails.status = "refunded";
        await order.save();

        return res.status(200).json({
          message: "Refund processed successfully",
          refundId: refund.id,
          order,
        });
      } catch (error) {
        return res.status(400).json({
          message: "Razorpay refund failed",
          error: error.message,
        });
      }
    }

    // For non-Razorpay payments
    order.refundAmount = refundAmount;
    order.paymentDetails.status = "refunded";
    await order.save();

    return res.status(200).json({
      message: "Refund processed successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get transaction history for user
export const GetTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const transactions = await Order.find({
      userId,
      "paymentDetails.status": { $in: ["completed", "refunded"] },
    })
      .select(
        "totalAmount paymentDetails.method paymentDetails.status orderStatus createdAt"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments({
      userId,
      "paymentDetails.status": { $in: ["completed", "refunded"] },
    });

    return res.status(200).json({
      message: "Transaction history retrieved successfully",
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get payment statistics for restaurant
export const GetPaymentStatistics = async (req, res, next) => {
  try {
    const restaurantId = req.user._id;
    const { startDate, endDate } = req.query;

    let dateFilter = {};

    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    }

    const stats = await Order.aggregate([
      {
        $match: {
          restaurantId: new (require("mongoose").Types.ObjectId)(
            restaurantId
          ),
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$paymentDetails.method",
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          completedTransactions: {
            $sum: {
              $cond: [
                { $eq: ["$paymentDetails.status", "completed"] },
                1,
                0,
              ],
            },
          },
          completedAmount: {
            $sum: {
              $cond: [
                { $eq: ["$paymentDetails.status", "completed"] },
                "$totalAmount",
                0,
              ],
            },
          },
        },
      },
    ]);

    const totalStats = await Order.aggregate([
      {
        $match: {
          restaurantId: new (require("mongoose").Types.ObjectId)(
            restaurantId
          ),
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          totalCompleted: {
            $sum: {
              $cond: [
                { $eq: ["$paymentDetails.status", "completed"] },
                "$totalAmount",
                0,
              ],
            },
          },
          totalRefunded: {
            $sum: {
              $cond: [
                { $eq: ["$paymentDetails.status", "refunded"] },
                "$refundAmount",
                0,
              ],
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      message: "Payment statistics retrieved successfully",
      stats,
      totals: totalStats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        totalCompleted: 0,
        totalRefunded: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Download invoice (generate PDF)
export const DownloadInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId).populate([
      { path: "userId", select: "fullName email mobileNumber" },
      { path: "restaurantId", select: "restaurantName email" },
    ]);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Verify authorization
    if (order.userId._id.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Not authorized to download this invoice",
      });
    }

    // Create invoice text/json for now (PDF generation would require additional library)
    const invoiceData = {
      invoiceNumber: `INV-${order._id}`,
      date: new Date().toISOString(),
      order: {
        id: order._id,
        status: order.orderStatus,
        createdAt: order.createdAt,
      },
      customer: {
        name: order.userId.fullName,
        email: order.userId.email,
        phone: order.userId.mobileNumber,
      },
      restaurant: {
        name: order.restaurantId.restaurantName,
        email: order.restaurantId.email,
      },
      items: order.items,
      pricing: {
        subtotal: order.subtotal,
        tax: order.taxAmount,
        delivery: order.deliveryCharge,
        discount: order.discountAmount,
        total: order.totalAmount,
      },
      payment: {
        method: order.paymentDetails.method,
        status: order.paymentDetails.status,
      },
      delivery: {
        address: order.deliveryAddress,
        estimatedTime: order.estimatedDeliveryTime,
        actualTime: order.actualDeliveryTime,
      },
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${order._id}.json"`
    );

    return res.json(invoiceData);
  } catch (error) {
    next(error);
  }
};
