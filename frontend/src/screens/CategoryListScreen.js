import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import {
	listCategories,
	deleteCategory,
	createCategory
} from '../actions/categoryActions.js';
import { CATEGORY_CREATE_RESET } from '../constants/categoryConstants';

const CategoryListScreen = ({ history, match }) => {
	const pageNumber = match.params.pageNumber || 1;

	const dispatch = useDispatch();

	const categoryList = useSelector(state => state.categoryList);
	const { loading, error, categories, pages, page } = categoryList;

	const categoryDelete = useSelector(state => state.categoryDelete);
	const {
		loading: loadingDelete,
		error: errorDelete,
		success: successDelete
	} = categoryDelete;

	const categoryCreate = useSelector(state => state.categoryCreate);
	const {
		loading: loadingCreate,
		error: errorCreate,
		success: successCreate,
		category: createdCategory
	} = categoryCreate;

	const userLogin = useSelector(state => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		dispatch({ type: CATEGORY_CREATE_RESET });

		if (!userInfo.isAdmin) {
			history.push('/login');
		}

		if (successCreate) {
			history.push(`/admin/category/${createdCategory._id}/edit`);
		} else {
			dispatch(listCategories('', pageNumber));
		}
	}, [
		dispatch,
		history,
		userInfo,
		successDelete,
		successCreate,
		createdCategory,
		pageNumber
	]);

	const deleteHandler = id => {
		if (window.confirm('Are you sure?')) {
			dispatch(deleteCategory(id));
		}
	};

	const createCategoryHandler = () => {
		dispatch(createCategory());
	};

	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Categories</h1>
				</Col>
				<Col className='text-right'>
					<Button className='my-3' onClick={createCategoryHandler}>
						<i className='fas fa-plus'></i> Create Category
					</Button>
				</Col>
			</Row>
			{loadingDelete && <Loader />}
			{errorDelete && <Message variant='danger'>{errorDelete}</Message>}
			{loadingCreate && <Loader />}
			{errorCreate && <Message variant='danger'>{errorCreate}</Message>}
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<>
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PARENT</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{categories.map(category => (
								<tr key={category._id}>
									<td>{category._id}</td>
									<td>{category.name}</td>
									<td>{ (category.parentCategory) ? category.parentCategory.name: ''}</td>
									<td>
										<LinkContainer to={`/admin/category/${category._id}/edit`}>
											<Button variant='light' className='btn-sm'>
												<i className='fas fa-edit'></i>
											</Button>
										</LinkContainer>
										<Button
											variant='danger'
											className='btn-sm'
											onClick={() => deleteHandler(category._id)}
										>
											<i className='fas fa-trash'></i>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Paginate pages={pages} page={page} isAdmin={true} />
				</>
			)}
		</>
	);
};

export default CategoryListScreen;
