import Order from "../models/orderModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new order
export const CreateOrder = async (req, res, next) => {
  try {
    const {
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      promoCode,
      orderNotes,
      subtotal,
      taxAmount,
      discountAmount,
      deliveryCharge,
      totalAmount,
    } = req.body;

    const userId = req.user._id;

    // Validation
    if (!restaurantId || !items || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (items.length === 0) {
      return res.status(400).json({
        message: "Cart cannot be empty",
      });
    }

    // Calculate item totals for validation
    let calculatedSubtotal = 0;
    for (const item of items) {
      if (!item.menuItemId || !item.quantity || !item.price) {
        return res.status(400).json({
          message: "Invalid item data",
        });
      }
      calculatedSubtotal += item.quantity * item.price;
    }

    // Create order object
    const orderData = {
      userId,
      restaurantId,
      items,
      deliveryAddress,
      paymentDetails: {
        method: paymentMethod,
        status: paymentMethod === "razorpay" ? "pending" : "completed",
      },
      orderStatus: "placed",
      subtotal: calculatedSubtotal,
      taxAmount: taxAmount || 0,
      discountAmount: discountAmount || 0,
      deliveryCharge: deliveryCharge || 0,
      totalAmount,
      promoCode: promoCode || null,
      orderNotes: orderNotes || "",
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    };

    // Handle different payment methods
    if (paymentMethod === "razorpay") {
      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // Convert to paise
        currency: "INR",
        receipt: `order_${Date.now()}`,
        notes: {
          orderId: userId.toString(),
          restaurantId: restaurantId.toString(),
        },
      });

      orderData.paymentDetails.razorpayOrderId = razorpayOrder.id;
    } else if (paymentMethod === "cash") {
      orderData.paymentDetails.status = "pending";
      orderData.orderStatus = "confirmed";
    } else {
      orderData.paymentDetails.status = "completed";
      orderData.orderStatus = "confirmed";
    }

    // Save order to database
    const newOrder = new Order(orderData);
    await newOrder.save();

    // Populate references if needed
    await newOrder.populate([
      { path: "userId", select: "fullName email mobileNumber" },
      { path: "restaurantId", select: "restaurantName" },
    ]);

    return res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders for a user
export const GetUserOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status, sortBy = "createdAt" } = req.query;

    let query = { userId };

    // Filter by status if provided
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate("restaurantId", "restaurantName")
      .sort({ [sortBy]: -1 })
      .limit(50);

    return res.status(200).json({
      message: "Orders retrieved successfully",
      orders,
      count: orders.length,
    });
  } catch (error) {
    next(error);
  }
};

// Get order details
export const GetOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId).populate([
      { path: "userId", select: "fullName email mobileNumber" },
      { path: "restaurantId", select: "restaurantName" },
      { path: "riderId", select: "fullName mobileNumber" },
    ]);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check if user has permission to view this order
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Not authorized to view this order",
      });
    }

    return res.status(200).json({
      message: "Order details retrieved successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Verify Razorpay payment
export const VerifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        message: "Payment verification failed - missing parameters",
      });
    }

    // Verify payment signature
    const body = orderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        message: "Payment verification failed - invalid signature",
      });
    }

    // Update order with payment details
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.paymentDetails.razorpayPaymentId = razorpayPaymentId;
    order.paymentDetails.status = "completed";
    order.orderStatus = "confirmed";

    await order.save();

    return res.status(200).json({
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order
export const CancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Check if user has permission
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Not authorized to cancel this order",
      });
    }

    // Cannot cancel delivered or already cancelled orders
    if (["delivered", "cancelled", "refunded"].includes(order.orderStatus)) {
      return res.status(400).json({
        message: `Cannot cancel order with status: ${order.orderStatus}`,
      });
    }

    order.orderStatus = "cancelled";
    order.cancellationReason = reason || "User requested cancellation";

    // Process refund if payment was completed
    if (order.paymentDetails.status === "completed") {
      order.paymentDetails.status = "refunding";
      order.refundAmount = order.totalAmount;
    }

    await order.save();

    // TODO: Implement actual refund processing
    // This should be handled by a separate refund service

    return res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get restaurant orders (for restaurant managers)
export const GetRestaurantOrders = async (req, res, next) => {
  try {
    const restaurantId = req.user._id; // User ID is the restaurant's user ID
    const { status, sortBy = "createdAt" } = req.query;

    let query = { restaurantId };

    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate("userId", "fullName mobileNumber email")
      .populate("riderId", "fullName mobileNumber")
      .sort({ [sortBy]: -1 })
      .limit(100);

    return res.status(200).json({
      message: "Restaurant orders retrieved successfully",
      orders,
      count: orders.length,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (for restaurant or admin)
export const UpdateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const restaurantId = req.user._id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const validStatuses = [
      "confirmed",
      "preparing",
      "ready",
      "on-way",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Verify restaurant ownership
    if (order.restaurantId.toString() !== restaurantId.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this order",
      });
    }

    order.orderStatus = status;

    if (status === "delivered") {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Rate order (for users)
export const RateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { rating, review, riderRating } = req.body;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Verify user owns this order
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Not authorized to rate this order",
      });
    }

    order.rating = rating;
    order.review = review || null;

    if (riderRating && riderRating >= 1 && riderRating <= 5) {
      order.riderRating = riderRating;
    }

    await order.save();

    return res.status(200).json({
      message: "Order rated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get order analytics (for restaurant dashboard)
export const GetOrderAnalytics = async (req, res, next) => {
  try {
    const restaurantId = req.user._id;
    const { period = "today" } = req.query;

    let dateFilter = {};

    const now = new Date();
    switch (period) {
      case "today":
        dateFilter = {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        };
        break;
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { $gte: weekAgo };
        break;
      case "month":
        const monthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        dateFilter = { $gte: monthAgo };
        break;
      default:
        dateFilter = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
    }

    const analytics = await Order.aggregate([
      {
        $match: {
          restaurantId: new (require("mongoose").Types.ObjectId)(
            restaurantId
          ),
          createdAt: dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ["$paymentDetails.status", "completed"] },
                "$totalAmount",
                0,
              ],
            },
          },
          averageOrderValue: {
            $avg: "$totalAmount",
          },
          ordersCompleted: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0],
            },
          },
          ordersCancelled: {
            $sum: {
              $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const stats = analytics[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      ordersCompleted: 0,
      ordersCancelled: 0,
    };

    return res.status(200).json({
      message: "Order analytics retrieved successfully",
      period,
      stats,
    });
  } catch (error) {
    next(error);
  }
};
