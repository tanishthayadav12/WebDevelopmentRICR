import express from "express";
import {
  GetPaymentDetails,
  ProcessRefund,
  GetTransactionHistory,
  GetPaymentStatistics,
  DownloadInvoice,
} from "../controllers/paymentController.js";
import { Protect, ManagerProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User routes
router.get("/:orderId/details", Protect, GetPaymentDetails);
router.post("/:orderId/refund", Protect, ProcessRefund);
router.get("/user/transactions", Protect, GetTransactionHistory);
router.get("/:orderId/invoice", Protect, DownloadInvoice);

// Restaurant manager routes
router.get("/restaurant/statistics", Protect, ManagerProtect, GetPaymentStatistics);

export default router;
