import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const FoodEntrySchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    date: { type: Date, required: true },
    meal_type: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    food_item: { type: String, required: true },
    initial_weight: { type: Number, required: true, min: 0.01 },
    remaining_weight: { type: Number, min: 0, default: null },
  },
  { timestamps: true }
);

const FoodEntry = mongoose.models.FoodEntry || mongoose.model("FoodEntry", FoodEntrySchema);
export default FoodEntry;
