import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const BookingSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 }, // UUID as primary key
    food_entry_id: { type: String, ref: "FoodEntry", required: true }, // Foreign key linking to FoodEntry
    person_name: { type: String, required: true, trim: true },
    contact_number: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v); // Ensures a valid 10-digit number
        },
        message: "Invalid contact number! Must be 10 digits.",
      },
    },
    trust_name: { type: String, required: true, trim: true },
    booking_date: { type: Date, default: Date.now }, // Defaults to current timestamp
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
