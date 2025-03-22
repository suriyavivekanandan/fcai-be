import Booking from "../../models/booking.model.js";
import FoodEntry from "../../models/foodEntry.model.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { food_entry_id, person_name, contact_number, trust_name } = req.body;

    if (!food_entry_id || !person_name || !contact_number || !trust_name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const foodEntry = await FoodEntry.findById(food_entry_id);
    if (!foodEntry) {
      return res.status(404).json({ message: "Food entry not found" });
    }

    if (foodEntry.booked) {
      return res.status(400).json({ message: "Food already booked" });
    }

    const newBooking = new Booking({
      food_entry_id,
      person_name,
      contact_number,
      trust_name,
    });
    await newBooking.save();

    foodEntry.remaining_weight = 0;
    foodEntry.booked = true;  // ✅ Mark as booked
    await foodEntry.save();

    const populatedBooking = await Booking.findById(newBooking._id).populate("food_entry_id");

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("food_entry_id");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("food_entry_id");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
