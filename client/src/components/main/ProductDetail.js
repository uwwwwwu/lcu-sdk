import React from 'react';
import axios from 'axios';

import {Link} from 'react-router-dom';

export default class ProductDetail extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {}
        }
    }

    componentDidMount() {
        this.props.setPageTitle('Product Detail');
        axios.get('http://master:8081/products/' + this.props.match.params.id).then(res => {
            console.log(res.data)
            if (res.data.status) {
                this.setState({ product: res.data.data })
            }
        }).catch(err => {
            console.log(err)
        })
    }
    render() {
        return (
            <div className="col-md-12 col-lg-8 col-xl-8">
                <div className="items" style={{ padding: '30px', paddingBottom: '15px' }}>
                    <h1><strong>충북 보은 생대추</strong></h1>
                </div>
                <div className="items" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                    <div className="product">
                        <div className="row justify-content-center align-items-center">
                            <div className="col-md-3">
                                <div className="product-image" style={{ padding: 0 }}>
                                    <img style={{width: '100%', height: '150px', objectFit: 'cover'}} className="img-fluid d-block mx-auto image" src={this.state.product.image} alt='thumbnail'/>
                                </div>
                            </div>
                            <div className="col-md-9 mb-auto product-info">
                                <Link className="product-name" to={'/purchase/' + this.props.match.params.id}>{this.state.product.product_name}</Link>
                                <div className="product-specs">
                                    <div><span>Farmhouse:&nbsp;</span><span className="value">{this.state.product.farmhouse}</span></div>
                                    <div><span>In stock:&nbsp;</span><span className="value">{this.state.product.amount}개</span></div>
                                    <div><span>Price:&nbsp;</span><span className="value">{this.state.product.price}원</span></div>
                                    <div>
                                        <Link to={'/purchase/' + this.props.match.params.id}>
                                            <button className="btn btn-outline-primary btn-sm text-center" type="button" style={{ margin: 0, marginBottom: '15px', padding: '6px 20px', marginTop: '15px' }}>Purchase</button>
                                        </Link>
                                    </div>
                                    <div><Link to={'/product-history/' + this.props.match.params.id}>View transaction history</Link></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="items" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                    <div className="product">
                        <div className="row justify-content-center align-items-center">
                            <div className="col-md-3">
                                <div className="product-image" style={{ padding: 0 }}><img className="img-fluid d-block mx-auto image" src="assets/img/fruit-1.jpg" alt='GAP Cert'/></div>
                            </div>
                            <div className="col-md-9 mb-auto product-info">
                                <div className="product-specs" style={{ marginBottom: '15px' }}>
                                    <div><span>GAP&nbsp;Certification status:&nbsp;</span><span className="value">O</span></div>
                                    <div><span>Environment-friendly certification status&nbsp;:&nbsp;</span><span className="value">O</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}