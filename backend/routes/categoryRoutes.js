import express from 'express';
import {
	getCategories,
	getCategoryById,
	deleteCategory,
	createCategory,
	updateCategory
} from '../controllers/categoriesController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router
	.route('/')
	.get(getCategories)
	.post(protect, admin, createCategory);
router
	.route('/:id')
	.get(getCategoryById)
	.delete(protect, admin, deleteCategory)
	.put(protect, admin, updateCategory);

export default router;