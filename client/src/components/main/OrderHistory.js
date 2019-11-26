import React from 'react';

export default class OrderHistory extends React.Component {
    componentDidMount() {
        this.props.setPageTitle('주문내역');
    }
    render() {
        return (
            <div className="col-md-12 col-lg-8 col-xl-8">
                <div className="items" style={{ padding: '30px', paddingBottom: '15px' }}>
                    <h1><strong>주문내역</strong><br /></h1>
                </div>
                <div className="items" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                    <div className="product"></div>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th><strong>주문번호</strong><br /></th>
                                    <th><strong>상품명</strong><br /></th>
                                    <th><strong>주문날짜</strong><br /></th>
                                    <th><strong>수량</strong></th>
                                    <th><strong>주문상</strong></th>
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
