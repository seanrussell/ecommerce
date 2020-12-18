import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { logout } from '../actions/userActions.js';
import { listCategories } from '../actions/categoryActions.js';
import SearchBox from './SearchBox';
import DropdownMenu from './DropdownMenu';

const Header = () => {
	const dispatch = useDispatch();
	const userLogin = useSelector(state => state.userLogin);
	const { userInfo } = userLogin;

	const categoryList = useSelector(state => state.categoryList);
    const { categories } = categoryList;

	const convertToMenu = (list, idAttr, parentAttr, childrenAttr) => {
		if (!idAttr) {
			idAttr = 'id';
		}

		if (!parentAttr) {
			parentAttr = 'parent';
		}

		if (!childrenAttr) {
			childrenAttr = 'children';
		}
	
		let treeList = [];
		let lookup = {};

		list.forEach((obj) => {
			lookup[obj[idAttr]] = obj;
			obj[childrenAttr] = [];
		});

		list.forEach((obj) => {
			if (obj[parentAttr] != null) {
				if (lookup[obj[parentAttr]] !== undefined) {
					lookup[obj[parentAttr]][childrenAttr].push(obj);
				} else {
					treeList.push(obj);
				}               
			} else {
				treeList.push(obj);
			}
		});

		return treeList;
	};

	const menu = convertToMenu(categories.map((category) => {
		let parentid = (category.parentCategory) ? category.parentCategory._id: 0;
		return {
			id: category._id,
			title: category.name,
			parentId: parentid
		}
	}), 'id', 'parentId', 'submenu');
	
	useEffect(() => {
		dispatch(listCategories(1));
	}, [dispatch]);

	
	const logoutHandler = () => {
		dispatch(logout());
	};
	return (
		<header>
			<Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
				<Container>
					<LinkContainer to='/'>
						<Navbar.Brand>eCommerce Store</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<Route render={({ history }) => <SearchBox history={history} />} />
						<Nav className='ml-auto'>
							<LinkContainer to='/cart'>
								<Nav.Link>
									<i className='fas fa-shopping-cart'></i>Cart
								</Nav.Link>
							</LinkContainer>
							{userInfo ? (
								<NavDropdown title={userInfo.name} id='username'>
									<LinkContainer to='/profile'>
										<NavDropdown.Item>Profile</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler}>
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							) : (
								<LinkContainer to='/login'>
									<Nav.Link>
										<i className='fas fa-user'></i>Sign In
									</Nav.Link>
								</LinkContainer>
							)}
							{userInfo && userInfo.isAdmin && (
								<NavDropdown title='Admin' id='adminmenu'>
									<LinkContainer to='/admin/userlist'>
										<NavDropdown.Item>Users</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/productlist'>
										<NavDropdown.Item>Products</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/orderlist'>
										<NavDropdown.Item>Orders</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/categorylist'>
										<NavDropdown.Item>Categories</NavDropdown.Item>
									</LinkContainer>
								</NavDropdown>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
				
			<DropdownMenu config={menu} />
			
		</header>
	);
};

export default Header;
