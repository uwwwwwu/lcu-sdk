import React from 'react';

export default class OrderHistory extends React.Component {
    componentDidMount() {
        this.props.setPageTitle('Order History');
    }
    render() {
        return (
            <div className="col-md-12 col-lg-8 col-xl-8">
                <div className="items" style={{ padding: '30px', paddingBottom: '15px' }}>
                    <h1><strong>Order Details Inquiry</strong><br /></h1>
                </div>
                <div className="items" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                    <div className="product"></div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th><strong>Order #</strong><br /></th>
                                    <th><strong>Product</strong><br /></th>
                                    <th><strong>Order Date</strong><br /></th>
                                    <th><strong>Amount</strong></th>
                                    <th><strong>Order Status</strong></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>A00001</td>
                                    <td>A농가 보은 대추<br /></td>
                                    <td>10/10/2019<br /></td>
                                    <td>1kg</td>
                                    <td>Delivered</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}