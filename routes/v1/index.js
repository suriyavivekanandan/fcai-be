import express from "express";
import bookingRoutes from "./booking.routes";
import foodEntryRoutes from "./foodEntry.routes";

const router = express.Router();

router.use("/booking", bookingRoutes);
router.use("/food-entry", foodEntryRoutes);

export default router;
