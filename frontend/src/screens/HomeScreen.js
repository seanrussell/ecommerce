import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { listCategoryDetails } from '../actions/categoryActions';
import { listProducts } from '../actions/productActions';
import { listProductsByCategoryId } from '../actions/productActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = ({ match }) => {
	const keyword = match.params.keyword;
	const pageNumber = match.params.pageNumber || 1;
	const categoryId = match.params.categoryId;

	const dispatch = useDispatch();

	const productList = useSelector(state => state.productList);
	const { loading, error, products, page, pages } = productList;

	console.info('PRODUCTS: ', products);

	const categoryDetails = useSelector(state => state.categoryDetails);
	const { category } = categoryDetails;

	const productCategory = useSelector(state => state.productCategory);
	const { prodcats } = productCategory;

	console.info('CAT', category);
	console.info('CATID', categoryId);
	console.info('PRODS IN CATS: ', prodcats);

	useEffect(() => {
		if (categoryId) {
			dispatch(listCategoryDetails(categoryId));
			dispatch(listProductsByCategoryId(categoryId));
		} else {
			dispatch(listProducts(keyword, pageNumber));
		}
	}, [dispatch, keyword, pageNumber, categoryId]);

	return (
		<>
			<Meta />
			{!keyword ? (
				<ProductCarousel />
			) : (
				<Link to='/' className='btn btn-light'>
					Go Back
				</Link>
			)}
			{ categoryId ? (
				<h1>Products in {category.name}</h1>
			) : (
				<h1>Latest Products</h1>
			)}
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'></Message>
			) : categoryId ? (
				<>
					<Row>
						{prodcats.length > 0 ? prodcats.map(product => (
							<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
								<Product product={product} />
							</Col>
						)): (
							<span className="no-products">There are currently no products in {category.name}</span>
						)}
					</Row>
				</>
			) : (
				<>
					<Row>
						{products.map(product => (
							<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
								<Product product={product} />
							</Col>
						))}
					</Row>
					<Paginate
						pages={pages}
						page={page}
						keyword={keyword ? keyword : ''}
					/>
				</>
			)}
		</>
	);
};

export default HomeScreen;
