import React from 'react';
import axios from 'axios';
import { Button } from 'react-materialize';
import { Link } from 'react-router-dom';

export default class ProductDetail extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            amount: '',
            userId: ''
        }
    }

    onAmountChanged(e) { this.setState({ amount: e.target.value })}
    onUserIdChanged(e) { this.setState({ userId: e.target.value })}

    componentDidMount() {
        this.props.setLoading(true);
        axios.get('http://master:8081/products/' + this.props.match.params.id).then(res => {
            this.props.setLoading(false);
            console.log(res.data)
            this.setState({
                product: res.data.data
            })
        }).catch(err => {
            this.props.setLoading(false);
        })
    }

    onFormSubmit(e) {
        e.preventDefault();
        axios.post('http://master:8081/buy-product', {
            buyerId: this.state.userId,
            productId: this.props.match.params.id,
            amount: this.state.amount
        }).then(res => {
            console.log(res.data)
            if (res.data.message) {
                alert(res.data.message)
            } else {
                alert(res.data.error)
            }
        }).catch(e => {
            console.log(e)
        })
    }


    render() {
        return (
            <div>
                <h4>{this.state.product.product_name}</h4>

                <div className='row'>
                    <div className='col s6'>
                        <div className='row'>
                            <div className='col s12'>
                                <img alt='Apple' style={{ width: '100%', objectFit: 'cover' }} src='https://media.npr.org/assets/img/2019/04/02/usda-cat-photo-4-002--01be5c36f4bfab6c95144cfef3ef98bfbffb6006-s1200.png' />
                                <p style={{ color: 'gray' }}>
                                    <Button style={{ backgroundColor: 'transparent ', boxShadow: 'none', padding: 0, cursor: 'pointer' }}
                                        tooltip={'Checked by ' + this.state.product.verified_by}>
                                        <i className="tiny material-icons" style={{ color: '#4caf50' }}>check_circle</i>
                                    </Button>  {this.state.product.farmhouse} • {this.state.product.farmhouse}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='col s6'>
                        <div className='row'>
                            <div className='col s6'>
                                <h5 style={{ marginTop: 0 }}>Product Information</h5>
                                <ul>
                                    <li><h6 style={{ marginTop: 0 }}>Available in stock: {this.state.product.amount}</h6></li>
                                    <li><h6>Price: {this.state.product.price}원</h6></li>
                                </ul>
                            </div>
                            <div className='col s6' style={{ textAlign: 'right' }}>
                                <Link to={'/product-history/' + this.props.match.params.id} className="waves-effect waves-light btn light-blue darken-3">
                                    <i className="material-icons left">access_time</i> View History
                                </Link>
                            </div>
                        </div>
                        <hr style={{ marginBottom: 20 }} />

                        <div className='row'>
                            <div className='col s12'>
                                <h5 style={{ marginTop: 0 }}>Purchase</h5>

                                <div className="row">
                                    <form className="col s12" onSubmit={this.onFormSubmit.bind(this)}>
                                        <div className="row">
                                            <div className="input-field col s6">
                                                <input id="first_name" type="number" className="validate" required value={this.state.amount} onChange={this.onAmountChanged.bind(this)} />
                                                <label htmlFor="first_name">Amount</label>
                                            </div>
                                            <div className="input-field col s6">
                                                <input id="last_name" type="text" className="validate" required value={this.state.userId} onChange={this.onUserIdChanged.bind(this)} />
                                                <label htmlFor="last_name">User ID</label>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <button className="btn waves-effect waves-light light-blue darken-3" type="submit" name="action">Purchase now
                                                    <i className="material-icons right">shopping_cart</i>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}