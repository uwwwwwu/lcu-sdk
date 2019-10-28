import React from 'react';

import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import PageNotFound from './components/PageNotFound';
import ProductHistory from './components/ProductHistory';
import ProductDetail from './components/ProductDetail';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoading: false
		}
	}

	render() {
		return (
			<BrowserRouter>
				<nav className='light-blue darken-3'>
					<div className="nav-wrapper">
						<div className='container'>
							<Link to='/' className="brand-logo">Life Cooperation Union</Link>
							<ul id="nav-mobile" className="right hide-on-med-and-down">
								<li><Link to='/'><i className='material-icons left'>directions_car</i>All Cars</Link></li>
								<li><Link to='/add'><i className="material-icons left">add_circle_outline</i>Add Car</Link></li>
							</ul>
						</div>
						{this.state.isLoading ? <div className="progress light-blue lighten-3"><div className="indeterminate light-blue darken-4"></div></div> : null}
					</div>
				</nav>
				<div className='container'>
					<Switch>
						<Route exact path="/" render={
							(props) => <ProductList {...props} setLoading={(status) => { this.setState({ isLoading: status }) }} />
						} />

						<Route exact path="/product/:id" render={
							(props) => <ProductDetail {...props} setLoading={(status) => { this.setState({ isLoading: status }) }} />
						} />

						<Route exact path="/add" render={
							(props) => <AddProduct {...props} setLoading={(status) => { this.setState({ isLoading: status }) }} />
						} />

						<Route exact path="/product-history/:id" render={
							(props) => <ProductHistory {...props} setLoading={(status) => { this.setState({ isLoading: status }) }} />
						} />

						<Route path='/*' component={PageNotFound} />
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;