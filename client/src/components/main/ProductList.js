import React from 'react';
import axios from 'axios';
import {API_HOST} from '../../ApiConfig';
import {Link} from 'react-router-dom';

export default class ProductList extends React.Component {
    constructor() {
        super();
        this.state = {
            products: []
        }
    }

    componentDidMount() {
        this.props.setPageTitle('상품목록');
        axios.get(API_HOST + '/products').then(res => {
            console.log(res.data)
            if (res.data.status) {
                this.setState({ products: res.data.data });
            }
        }).catch(e => {
            console.log(e)
        })
    }
    render() {
        let productCards = this.state.products.map(p => {
            return <div key={p.product_id} className="col-md-6 col-lg-4" style={{ paddingBottom: 20}}>
                <div className="card" style={{ height: 384 }}>
                    <img className="card-img-top w-100 d-block" src={p.image} alt='thumbnail' style={{width:'100%', height: 200, objectFit: 'cover'}} />
                    <div className="card-body">
                        <h4 className="card-title text-center">{p.product_name}<br /></h4>
                        <p className="card-text text-center">{p.amount}개 • {p.price}원<br /></p>
                    </div>
                    <div className="text-center"><Link to={'/products/' + p.product_id}><button className="btn btn-outline-primary btn-sm" type="button" style={{ marginBottom: '15px', padding: '6px 20px' }}>Detail</button></Link></div>
                </div>
            </div>
        });
        return (
            <div className="col-md-12 col-lg-8 col-xl-8">
                <div className="items">
                    <div className="row">
                        {productCards}
                    </div>
                </div>
            </div>
        )
    }
}
