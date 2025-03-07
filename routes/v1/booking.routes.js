const express = require("express");
const router = express.Router();
const bookingController = require("../../controllers/v1/booking.controller");

router.get("/available", bookingController.getAvailableFood);
router.get("/", bookingController.getAllBookings);
router.post("/", bookingController.createBooking);

module.exports = router;
