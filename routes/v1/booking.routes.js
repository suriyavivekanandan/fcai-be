import express from "express";
import * as bookingController from "../../controllers/v1/booking.controller.js";

const router = express.Router();

// POST /api/v1/booking - Create a new booking
router.post("/", bookingController.createBooking);

// GET /api/v1/booking - Get all bookings
router.get("/", bookingController.getAllBookings);

// GET /api/v1/booking/:id - Get a single booking
router.get("/:id", bookingController.getBookingById);

// DELETE /api/v1/booking/:id - Delete a booking
router.delete("/:id", bookingController.deleteBooking);

export default router;