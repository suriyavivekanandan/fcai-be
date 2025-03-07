import express from 'express';
import { 
  createFoodEntry, 
  getFoodEntries, 
  getFoodEntryById, 
  updateFoodEntry, 
  deleteFoodEntry 
} from '../../controllers/v1/foodEntry.controller';

const router = express.Router();

router.post('/', createFoodEntry);
router.get('/', getFoodEntries);
router.get('/:id', getFoodEntryById);
router.put('/:id', updateFoodEntry);
router.delete('/:id', deleteFoodEntry);

export default router;
