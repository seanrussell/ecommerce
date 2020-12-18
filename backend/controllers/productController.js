import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 10;
	const page = Number(req.query.pageNumber) || 1;

	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'i'
				}
		  }
		: {};

	const countDocuments = await Product.count({ ...keyword });
	const products = await Product.find({ ...keyword })
		.populate('group')
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	res.json({ products, page, pages: Math.ceil(countDocuments / pageSize) });
});

// @desc Fetch all products in a category or in a category below
// @route GET /api/products/category
// @access Public
const getProductsByCategoryId = asyncHandler(async (req, res) => {
	const categoryId = req.params.id;

	// Not very efficient and limited to 2 nested levels
	let categoryIds = [categoryId];
	let nextCategories = await Category.find({ parentCategory: { $in: categoryIds }});

	if (nextCategories && nextCategories.length > 0) {
		let nextCategoryIds = nextCategories.map((category) => {
			return category._id;
		});

		categoryIds = [...categoryIds, ...nextCategoryIds];

		nextCategories = await Category.find({ parentCategory: { $in: categoryIds }});
		
		if (nextCategories && nextCategories.length > 0) {
			nextCategoryIds = nextCategories.map((category) => {
				return category._id;
			});
	
			categoryIds = [...categoryIds, ...nextCategoryIds];
		}
	}

	const products = await Product.find({ group: { $in: categoryIds }});

	res.json({ products });
});

// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}

	res.json(product);
});

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		await product.remove();
		res.json({ message: 'Product removed' });
	} else {
		res.status(404);
		throw new Error('Product not found');
	}

	res.json(product);
});

// @desc Create product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		name: 'Sample Name',
		price: 0,
		user: req.user._id,
		image: '/images/sample.jpg',
		brand: 'Sample Brand',
		category: 'Sample Category',
		countInStock: 0,
		numReviews: 0,
		description: 'Sample Description'
	});

	const createdProduct = await product.save();

	res.status(201).json(createdProduct);
});

// @desc Update product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
	const {
		name,
		price,
		description,
		image,
		brand,
		category,
		countInStock,
		group
	} = req.body;

	const product = await Product.findById(req.params.id);

	if (product) {
		product.name = name;
		product.price = price;
		product.description = description;
		product.image = image;
		product.brand = brand;
		product.category = category;
		product.countInStock = countInStock;
		product.group = group;

		const updatedProduct = await product.save();

		res.json(updatedProduct);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc Create new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body;

	const product = await Product.findById(req.params.id);

	if (product) {
		const alreadyReviewed = product.reviews.find(
			r => r.user.toString() === req.user._id.toString()
		);
		if (alreadyReviewed) {
			res.status(400);
			throw new Error('Product already reviewed');
		}

		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			user: req.user._id
		};

		product.reviews.push(review);

		product.numReviews = product.reviews.length;

		product.rating =
			product.reviews.reduce((acc, item) => item.rating + acc, 0) /
			product.reviews.length;

		await product.save();

		res.status(201).json({ message: 'Review added' });
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc Get top rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({})
		.sort({ rating: -1 })
		.limit(3);

	res.json(products);
});

export {
	getProducts,
	getProductById,
	getProductsByCategoryId,
	deleteProduct,
	createProduct,
	updateProduct,
	createProductReview,
	getTopProducts
};
