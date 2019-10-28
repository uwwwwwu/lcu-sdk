import React from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

export default class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        }
    }

    componentDidMount() {
        this.props.setLoading(true);
        axios.get('http://master:8081/products').then(res => {
            this.props.setLoading(false);
            console.log(res.data)
            this.setState({ products: res.data.data });
        }).catch(e => {
            this.props.setLoading(false);
            console.log(e)
        })
    }

    render() {
        const tbody = this.state.products.map(p => {
            return <tr key={p.product_id}>
                <td>{p.product_id}</td>
                <td>{p.product_name}</td>
                <td>{p.price}원</td>
                <td>{p.amount}</td>
                <td>{p.farmhouse}</td>
                <td>{p.imported_by.name}</td>
                <td><i className="tiny material-icons" style={{color: '#4caf50'}}>check_circle</i> {p.verified_by}</td>
                <td>
                    <Link to={'/product/' + p.product_id} className="waves-effect waves-light btn light-blue darken-3"><i className="material-icons">visibility</i></Link>
                    <span> </span>
                    <Link to={'/product-history/' + p.product_id} className="waves-effect waves-light btn light-blue darken-3"><i className="material-icons">access_time</i></Link>
                </td>
            </tr>
        })
        return (
            <div>
                <h4>Product List</h4>
                <table className='striped responsive-table centered'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Farm House</th>
                            <th>Supplier</th>
                            <th>Checked by</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tbody}
                    </tbody>
                </table>
            </div>
        )
    }
}