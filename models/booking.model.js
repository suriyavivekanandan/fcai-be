import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const BookingSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    food_entry_id: { type: String, ref: "FoodEntry", required: true },
    person_name: { type: String, required: true, trim: true },
    contact_number: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: v => /^[0-9]{10}$/.test(v),
        message: "Invalid contact number! Must be 10 digits.",
      },
    },
    trust_name: { type: String, required: true, trim: true },
    booking_date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
export default Booking;
