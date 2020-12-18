import asyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';

// @desc Fetch all categories
// @route GET /api/categories
// @access Public
const getCategories = asyncHandler(async (req, res) => {
	const pageSize = 10;
	const page = Number(req.query.pageNumber) || 1;

	const countDocuments = await Category.estimatedDocumentCount({});
    const categories = await Category.find({})
        .populate('parentCategory')
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	res.json({ categories, page, pages: Math.ceil(countDocuments / pageSize) });
});

// @desc Fetch single category
// @route GET /api/categories/:id
// @access Public
const getCategoryById = asyncHandler(async (req, res) => {
	const category = await Category.findById(req.params.id);

	if (category) {
		res.json(category);
	} else {
		res.status(404);
		throw new Error('Category not found');
	}

	res.json(category);
});

// @desc Delete category
// @route DELETE /api/categories/:id
// @access Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
	const category = await Category.findById(req.params.id);

	if (category) {
		await category.remove();
		res.json({ message: 'Category removed' });
	} else {
		res.status(404);
		throw new Error('Category not found');
	}

	res.json(category);
});

// @desc Create category
// @route POST /api/category
// @access Private/Admin
const createCategory = asyncHandler(async (req, res) => {
	const category = new Category({
		name: 'Sample Category Name'
	});

	const createdCategory = await category.save();

	res.status(201).json(createdCategory);
});

// @desc Update category
// @route PUT /api/categories/:id
// @access Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
	const {
		name,
		parentCategory
	} = req.body;

	const category = await Category.findById(req.params.id);

	if (category) {
		category.name = name;
		category.parentCategory = parentCategory;
	
		const updatedCategory = await category.save();

		res.json(updatedCategory);
	} else {
		res.status(404);
		throw new Error('Category not found');
	}
});

export {
    getCategories,
	getCategoryById,
	deleteCategory,
	createCategory,
	updateCategory
};
