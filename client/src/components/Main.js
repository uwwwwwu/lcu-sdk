import React from 'react';
import UserCard from './main/UserCard';
import Cooperative from './main/Cooperative';

import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ProductList from './main/ProductList';
import OrderHistory from './main/OrderHistory';
import ProductDetail from './main/ProductDetail';
import Purchase from './main/Purchase';
import AddProduct from './main/AddProduct';

export default class Main extends React.Component {
    constructor() {
        super();
        this.state = {
            pageTitle: ''
        }
    }
    render() {
        const style = {
            active: {
                backgroundColor: 'rgb(177,207,149)', fontWeight: 'bold', borderRadius: 0, borderWidth: 0
            },
            normal: {
                backgroundColor: 'rgb(230,240,220)', color: 'rgb(73,80,87)', fontWeight: 'bold', borderRadius: 0, borderWidth: 0
            }
        }
        return (
            <Router>
                <main className="page shopping-cart-page">
                    <section className="clean-block clean-cart dark">
                        <div className="container">
                            <div className="block-heading">
                                <h2 className="text-success">{this.state.pageTitle}</h2>
                                <div className="product">
                                    <div className="row justify-content-center align-items-center">
                                        <div className="col-md-4">
                                            <div className="product-image"><img className="img-fluid d-block mx-auto image" alt='logo' src="assets/img/coop-logo.png" /></div>
                                        </div>
                                        <div className="col-md-8 product-info">
                                            <div>
                                                <ul className="nav nav-tabs nav-fill">
                                                    <Link to='/' className='nav-item'><span className="nav-link border-secondary" style={this.state.pageTitle === 'Cooperative' ? style.active : style.normal}>소개</span></Link>
                                                    <Link to='/products' className='nav-item'><span className="nav-link border-secondary" style={this.state.pageTitle === 'Product List' || this.state.pageTitle === 'Product Detail' || this.state.pageTitle === 'Purchase' ? style.active : style.normal}>상품목록</span></Link>
                                                    <Link to='/order-history' className='nav-item'><span className="nav-link border-secondary" style={this.state.pageTitle === 'Order History' ? style.active : style.normal}>주문내역</span></Link>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="content">
                                <div className="row no-gutters">
                                    <UserCard />
                                    <Switch>
                                        <Route exact path="/" render={
                                            (props) => <Cooperative {...props} setPageTitle={(title) => { this.setState({ pageTitle: title }) }} />
                                        } />
                                        <Route exact path="/products" render={
                                            (props) => <ProductList {...props} setPageTitle={(title) => { this.setState({ pageTitle: title }) }} />
                                        } />
                                        <Route exact path="/products/:id" render={
                                            (props) => <ProductDetail {...props} setPageTitle={(title) => { this.setState({ pageTitle: title }) }} />
                                        } />
                                        <Route exact path="/purchase/:id" render={
                                            (props) => <Purchase {...props} setPageTitle={(title) => { this.setState({ pageTitle: title }) }} />
                                        } />
                                        <Route exact path="/order-history" render={
                                            (props) => <OrderHistory {...props} setPageTitle={(title) => { this.setState({ pageTitle: title }) }} />
                                        } />

                                        <Route exact path="/add-product" render={
                                            (props) => <AddProduct {...props} setPageTitle={(title) => { this.setState({ pageTitle: title }) }} />
                                        } />



                                        {/* <Route exact path='/order-history' component={OrderHistory} /> */}
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </Router>
        )
    }
}
