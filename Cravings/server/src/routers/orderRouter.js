import express from "express";
import {
  CreateOrder,
  GetUserOrders,
  GetOrderDetails,
  VerifyPayment,
  CancelOrder,
  GetRestaurantOrders,
  UpdateOrderStatus,
  RateOrder,
  GetOrderAnalytics,
} from "../controllers/orderController.js";
import { Protect, ManagerProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User routes (protected)
router.post("/create", Protect, CreateOrder);
router.get("/user-orders", Protect, GetUserOrders);
router.get("/:orderId", Protect, GetOrderDetails);
router.post("/verify-payment", Protect, VerifyPayment);
router.patch("/:orderId/cancel", Protect, CancelOrder);
router.patch("/:orderId/rate", Protect, RateOrder);

// Restaurant manager routes (protected)
router.get("/restaurant/orders", Protect, ManagerProtect, GetRestaurantOrders);
router.patch(
  "/restaurant/:orderId/update-status",
  Protect,
  ManagerProtect,
  UpdateOrderStatus
);
router.get(
  "/restaurant/analytics",
  Protect,
  ManagerProtect,
  GetOrderAnalytics
);

export default router;
