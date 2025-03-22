import express from "express";
import * as bookingController from "../../controllers/v1/booking.controller.js";

const router = express.Router();

router.post("/", bookingController.createBooking);
router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.delete("/:id", bookingController.deleteBooking);

export default router;
