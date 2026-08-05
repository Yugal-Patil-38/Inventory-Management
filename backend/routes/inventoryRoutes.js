import express from 'express';
import {
  adjustStock,
  getActivity,
  getHistory,
} from '../controllers/inventoryController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getActivity);
router.post('/:productId', adjustStock);
router.get('/:productId', getHistory);

export default router;
