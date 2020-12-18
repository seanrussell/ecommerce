import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import {
	listCategoryDetails,
	updateCategory
} from '../actions/categoryActions.js';
import { CATEGORY_UPDATE_RESET } from '../constants/categoryConstants';
import axios from 'axios';

const CategoryEditScreen = ({ match, history }) => {
	const categoryId = match.params.id;

	const [name, setName] = useState('');
	const [parentCategory, setParentCategory] = useState('');
	
	const dispatch = useDispatch();

	const categoryDetails = useSelector(state => state.categoryDetails);
    const { loading, error, category } = categoryDetails;
    
    const categoryList = useSelector(state => state.categoryList);
    const { loading: loadingList, error: errorList, categories } = categoryList;
    
    let categoriesList = categories.filter(category => {
        return category._id !== categoryId
    });

    categoriesList.unshift({
        _id: null,
        name: 'Choose parent category'
    });

	const categoryUpdate = useSelector(state => state.categoryUpdate);
	const {
		loading: loadingUpdate,
		error: errorUpdate,
		success: successUpdate
	} = categoryUpdate;

	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: CATEGORY_UPDATE_RESET });
			history.push('/admin/categorylist');
		} else {
			if (!category.name || category._id !== categoryId) {
				dispatch(listCategoryDetails(categoryId));
			} else {
				setName(category.name);
				setParentCategory(category.parentCategory);
			}
		}
	}, [dispatch, history, categoryId, category, successUpdate]);

	const submitHandler = e => {
		e.preventDefault();
		dispatch(
			updateCategory({
				_id: categoryId,
				name,
				parentCategory
			})
		);
	};

	return (
		<>
			<Link to='/admin/categorylist' className='btn btn-light my-3'>
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit Category</h1>
				{loadingUpdate && <Loader />}
				{errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter name'
								value={name}
								onChange={e => setName(e.target.value)}
							></Form.Control>
						</Form.Group>
						<Form.Group controlId='price'>
							<Form.Label>Parent Category</Form.Label>
                            <Form.Control
                                as='select'
                                value={parentCategory}
                                onChange={e => setParentCategory(e.target.value)}
                            >
                                {categoriesList.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
						</Form.Group>

						<Button type='submit' variant='primary'>
							Update
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	);
};

export default CategoryEditScreen;
