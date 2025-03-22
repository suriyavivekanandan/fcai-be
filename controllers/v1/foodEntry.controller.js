import FoodEntry from "../../models/foodEntry.model.js";

// Create a new food entry
export const createFoodEntry = async (req, res) => {
  try {
    const { date, meal_type, food_item, initial_weight } = req.body;

    if (!date || !meal_type || !food_item || initial_weight == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newEntry = new FoodEntry({ date, meal_type, food_item, initial_weight });
    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all food entries
export const getFoodEntries = async (req, res) => {
  try {
    const entries = await FoodEntry.find();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get available food (not booked)
export const getAvailableFood = async (req, res) => {
  try {
    const availableFood = await FoodEntry.find({ booked: false });
    res.status(200).json(availableFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single food entry by ID
export const getFoodEntryById = async (req, res) => {
  try {
    const entry = await FoodEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a food entry
export const updateFoodEntry = async (req, res) => {
  try {
    const { remaining_weight } = req.body;
    const entry = await FoodEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    const parsedWeight = parseFloat(remaining_weight);
    if (isNaN(parsedWeight) || parsedWeight < 0 || parsedWeight > entry.initial_weight) {
      return res.status(400).json({ message: "Invalid remaining weight" });
    }

    entry.remaining_weight = parsedWeight;
    await entry.save();

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a food entry
export const deleteFoodEntry = async (req, res) => {
  try {
    const deletedEntry = await FoodEntry.findByIdAndDelete(req.params.id);
    if (!deletedEntry) return res.status(404).json({ message: "Entry not found" });

    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
