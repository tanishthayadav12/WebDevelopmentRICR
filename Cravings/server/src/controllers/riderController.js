import Order from "../models/orderModel.js";
import { calculateDistance } from "../utils/riderUtility.js";

export const RiderGetAvailableOrder = async (req, res, next) => {
  try {
    const { lat, lon } = req.body;

    const availableOrders = await Order.find({
      riderId: null,
      status: {
        $ne: "pending",
        $ne: "cancelled",
        $ne: "delivered",
        $ne: "rejected",
      },
    })
      .populate("userId")
      .populate("restaurantId");

    const AvailableOrdersWithDistance = await calculateDistance(
      availableOrders,
      lat,
      lon,
    );

    res.status(200).json({
      message: "Available Orders Fetched Successfully",
      data: AvailableOrdersWithDistance,
    });
  } catch (error) {
    next(error);
  }
};

export const RiderGetOngoingOrder = async (req, res, next) => {
  try {
    const currentuser = req.user;
    const ongoingOrders = await Order.find({
      riderId: currentuser._id,
      status: {
        $in: ["accepted", "preparing", "ready", "pickedUp", "onTheWay"],
      },
    })
      .populate("userId")
      .populate("restaurantId");

    res.status(200).json({
      message: "Ongoing Orders Fetched Successfully",
      data: ongoingOrders,
    });
  } catch (error) {
    next(error);
  }
};

export const RiderGetCompletedOrder = async (req, res, next) => {
  try {
    const currentuser = req.user;
    const completedOrders = await Order.find({
      riderId: currentuser._id,
      status: {
        $in: ["delivered", "refused", "damaged", "cancelled", "rejected"],
      },
    })
      .populate("userId")
      .populate("restaurantId");

    res.status(200).json({
      message: "Completed Orders Fetched Successfully",
      data: completedOrders,
    });
  } catch (error) {
    next(error);
  }
};

export const RiderAcceptOrder = async (req, res, next) => {
  try {
    const riderId = req.user._id;
    const orderID = req.params.id;
    const currentOrder = await Order.findById(orderID);

    if (!currentOrder) {
      const error = new Error("Order Not Found");
      error.statusCode = 404;
      return next(error);
    }

    currentOrder.riderId = riderId;
    await currentOrder.save();

    res.status(200).json({ message: "Order Assingned to you" });
  } catch (error) {
    next(error);
  }
};
