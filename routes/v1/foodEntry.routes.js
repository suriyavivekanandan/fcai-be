import express from 'express';
import { 
  createFoodEntry, 
  getFoodEntries, 
  getAvailableFood,   // ✅ Add this import
  getFoodEntryById, 
  updateFoodEntry, 
  deleteFoodEntry 
} from '../../controllers/v1/foodEntry.controller'; // ✅ Make sure the path matches your controller file name

const router = express.Router();

router.post('/', createFoodEntry);
router.get('/', getFoodEntries);
router.get('/available', getAvailableFood);  // ✅ Route for fetching only unbooked food
router.get('/:id', getFoodEntryById);
router.put('/:id', updateFoodEntry);
router.delete('/:id', deleteFoodEntry);

export default router;
