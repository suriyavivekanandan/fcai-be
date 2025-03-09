import express from "express";
import bookingRoutes from "./booking.routes.js";
import foodEntryRoutes from "./foodEntry.routes.js"; // <-- Add .js

const router = express.Router();

router.use("/booking", bookingRoutes);
router.use("/food-entry", foodEntryRoutes);

export default router;
