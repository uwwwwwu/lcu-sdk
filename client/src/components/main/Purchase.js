import React from 'react';
import axios from 'axios';

export default class Purchase extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            amount: 1
        }
    }

    onAmountChange(e) {
        this.setState({amount: e.target.value});
    }

    componentDidMount() {
        this.props.setPageTitle('Purchase');
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
                    <h1><strong>Order / Payment</strong></h1>
                </div>
                <div className="items" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                    <div className="product"></div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th><strong>Product Information</strong></th>
                                    <th><strong>Seller</strong></th>
                                    <th><strong>Price</strong></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td rowSpan={2}>
                                        <div className="row justify-content-center align-items-center">
                                            <div className="col-md-3">
                                                <div className="product-image" style={{ padding: 0 }}><img className="img-fluid d-block mx-auto image" src={this.state.product.image} style={{ width: '700px', height: '100px', objectFit: 'cover' }} alt='thumbnail' /></div>
                                            </div>
                                            <div className="col-md-9 mb-auto product-info">
                                                <div className="product-specs">
                                                    <div><span>{this.state.product.product_name}</span></div>
                                                </div>
                                            </div>
                                        </div></td>
                                    <td>{this.state.product.farmhouse}</td>
                                    <td>{this.state.product.price}원</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon3"><i className="icon-basket icon"></i></span>
                                            </div>
                                            <input type="number" className="form-control" value={this.state.amount} onChange={this.onAmountChange.bind(this)} placeholder='Amount'/>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="content">
                    <div className="row no-gutters">
                        <div className="col-md-7 col-lg-7">
                            <div className="items" style={{ backgroundColor: 'rgb(247,251,255)' }}>
                                <div className="products">
                                    <h4 className="title">Delivery Information</h4>
                                    <div className="item"><span className="price" style={{ fontWeight: 'bold' }}>Name :</span>
                                        <p className="item-name">Kokpheng Yin</p>
                                    </div>
                                    <div className="item"><span className="price" style={{ fontWeight: 'bold' }}>Phone :</span>
                                        <p className="item-name">010 – 1234 – 5678</p>
                                    </div>
                                    <div className="item"><span className="price" style={{ fontWeight: 'bold' }}>Address :</span>
                                        <p className="item-name">청주시 서원구 충대로1, 충북대학교 S21-4, OOO호</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5 col-lg-5">
                            <div className="summary">
                                <h3>Summary</h3>
                                <h4><span className="text"><strong>Payment Amt:</strong></span><span className="price" style={{ marginLeft: 0 }}>{this.state.product.price * this.state.amount}원</span></h4><button className="btn btn-primary btn-block btn-lg" type="button"><strong>Payment</strong></button></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}