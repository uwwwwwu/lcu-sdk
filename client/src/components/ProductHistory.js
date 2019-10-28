import React from 'react';
import axios from 'axios';

export default class ProductHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            histories: [],
            product_name: '',
            product_id: ''
        }
    }

    componentDidMount() {
        this.props.setLoading(true);
        axios.get('http://master:8081/product-history/' + this.props.match.params.id).then(res => {
            this.props.setLoading(false);
            console.log(res.data)
            this.setState({
                histories: res.data.data,
                product_id: res.data.data[0].value.product_id,
                product_name: res.data.data[0].value.product_name
            })
        }).catch(err => {
            this.props.setLoading(false);
        })
    }

    render() {
        const tbody = this.state.histories.map(h => {
            return <tr key={h.txn}>
                <td>{h.value.modified_date}</td>
                <td>{h.value.price}원</td>
                <td>{h.value.amount}</td>
                <td>{h.value.farmhouse}</td>
                <td><i className="tiny material-icons" style={{color: '#4caf50'}}>check_circle</i> {h.value.verified_by}</td>
                <td>{h.value.remark}</td>
            </tr>
        })
        return (
            <div>
                <h4>{ this.state.product_name === '' ? 'Loading product history...' : 'Product History: (' + this.state.product_id + ') ' + this.state.product_name}</h4>
                <table className='striped responsive-table centered'>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>Farm House</th>
                            <th>Checked by</th>
                            <th>Transaction detail</th>
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