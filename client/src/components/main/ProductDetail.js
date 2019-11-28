import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { API_HOST } from '../../ApiConfig';
import { Link } from 'react-router-dom';

export default class ProductDetail extends React.Component {
    constructor() {
        super();
        this.state = {
            product: {},
            histories: [],
            detailHidden: true,
            detailData: {},
            gapCertificate: {},
            isValidGAP: false
        }
    }

    componentDidMount() {
        this.props.setPageTitle('Product Detail');
        axios.get(API_HOST + '/products/' + this.props.match.params.id).then(res => {
            console.log(res.data)
            if (res.data.status) {
                this.setState({ product: res.data.data });
                
                // fetch product history
                axios.get(API_HOST + '/product-history/' + this.props.match.params.id).then(res => {
                    if (res.data.status) {
                        this.setState({ histories: res.data.data.reverse() });
                    } else {
                        alert(res.data.error)
                    }
                }).catch(err => {
                    console.log(err)
                });

                // fetch gap certificate
                axios.get(API_HOST + '/gap-certificate/' + res.data.data.gap_certificate_number).then(res => {
                    if (res.data.status) {
                        this.setState({gapCertificate: res.data.data, isValidGAP: res.data.is_valid_certificate});
                    } else (
                        alert(res.data.error)
                    )
                }).catch(err => {
                    console.log(err)
                })
            } else {
                alert(res.data.error)
            }
        }).catch(err => {
            console.log(err)
        });
    }

    onTxnClick(index) {
        this.setState({ detailHidden: false, detailData: this.state.histories[index] });
    }

    render() {
        let histories = this.state.histories.map((h, index) => {
            return <tr key={h.txn}>
                <td>{moment(h.value.modified_date).local().format('DD-MMM-YYYY [at] hh:mm:ss A')}</td>
                <td>{h.value.price}원</td>
                <td>{h.value.amount}개</td>
                <td>{h.value.remark}</td>
                <td>
                    <p index={index} onClick={this.onTxnClick.bind(this, index)} style={{ color: '#007bff', cursor: 'pointer' }}>
                        {h.txn.slice(0, 10) + ' . . . ' + h.txn.slice(54, 64)}
                    </p>
                </td>
            </tr>
        });

        let detail = this.state.detailData.txn ? <div className='row'>
            <div className="col-md-6">
                <p>Product Name: <span style={{ color: '#007bff' }}>{this.state.detailData.value.product_name}</span></p>
                <p>Farmhouse: <span style={{ color: '#007bff' }}>{this.state.detailData.value.farmhouse}</span></p>
                <p>Amount: <span style={{ color: '#007bff' }}>{this.state.detailData.value.amount}개</span></p>
                <p>Price: <span style={{ color: '#007bff' }}>{this.state.detailData.value.price}원</span></p>
                <p>Supplier: <span style={{ color: '#007bff' }}>{this.state.detailData.value.imported_by.name}</span></p>
            </div>
            <div className="col-md-6">
                <p>GAP Certificate Number: <span style={{ color: '#007bff' }}>{this.state.detailData.value.gap_certificate_number}</span></p>
                <p>Environment-frie2ndly Certificate #: <span style={{ color: '#007bff' }}>{this.state.detailData.value.environment_friendly_certificate_number}</span></p>
                <p>Timestamp: <span style={{ color: '#007bff' }}>{moment(this.state.detailData.value.modified_date).local().format('DD-MMM-YYYY [at] hh:mm:ss A')}</span></p>
                <p>Remark: <span style={{ color: '#007bff' }}>{this.state.detailData.value.remark}</span></p>
            </div>
        </div> : ''
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
                                    <img style={{ width: '100%', height: '150px', objectFit: 'cover' }} className="img-fluid d-block mx-auto image" src={this.state.product.image} alt='thumbnail' />
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
                                    <div><Link to={'#'} data-toggle="modal" data-target="#transaction-history">View transaction history</Link></div>
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
                                <div className="product-image" style={{ padding: 0 }}><img className="img-fluid d-block mx-auto image" src="assets/img/fruit-1.jpg" alt='GAP Cert' /></div>
                            </div>
                            <div className="col-md-9 mb-auto product-info">
                                <div className="product-specs" style={{ marginBottom: '15px' }}>
                                    <div>GAP Certificate: <Link to={'#'} data-toggle="modal" data-target="#gap-cert">{this.state.product.gap_certificate_number}</Link> <i style={this.state.isValidGAP ? {color:'#00854a'} : {color:'red'}} className={this.state.isValidGAP ? 'icon-check icon' : 'icon-close icon'}></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Transaction */}
                <div className="modal fade bd-example-modal-xl" id="transaction-history" tabIndex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{this.state.product.product_name}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <h5>Transaction histories</h5>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Timestamp</th>
                                                <th scope="col">Price</th>
                                                <th scope="col">Amount</th>
                                                <th scope="col">Detail</th>
                                                <th scope="col">Txn</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {histories}
                                        </tbody>
                                    </table>
                                </div>
                                <br />
                                <div style={this.state.detailHidden ? { display: 'none' } : {}}>
                                    <h5>Detail of Txn: <span style={{ color: '#007bff' }}>{this.state.detailData.txn ? this.state.detailData.txn : ''}</span></h5>
                                    <hr />
                                    {detail}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { this.setState({ detailHidden: true }) }}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Modal Transaction */}

                {/* Modal GAP Cert */}
                <div className="modal fade" id="gap-cert" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog  modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">GAP Certificate Information <i style={this.state.isValidGAP ? {color:'#00854a'} : {color: 'red'}} className={this.state.isValidGAP ? 'icon-check icon' : 'icon-close icon'}></i></h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <table>
                                            <tbody>
                                                <tr><td>인증번호</td><td>:</td><td style={{color: '#007bff'}}>{this.state.gapCertificate.certificate_number}</td></tr>
                                                <tr><td>인증기관</td><td>:</td><td style={{color: '#007bff'}}>{this.state.gapCertificate.certificate_agency}</td></tr>
                                                <tr><td>개인/단체 구분명</td><td>:</td><td style={{color: '#007bff'}}>{this.state.gapCertificate.classification_name}</td></tr>
                                                <tr><td>생산자단체명</td><td>:</td><td style={{color: '#007bff'}}>{this.state.gapCertificate.producer_organization}</td></tr>
                                                <tr><td>유효기간 시작일</td><td>:</td><td style={{color: '#007bff'}}>{moment(this.state.gapCertificate.valid_from).local().format('DD-MMM-YYYY')}</td></tr>
                                                <tr><td>유효기간 종료일</td><td>:</td><td style={{color: '#007bff'}}>{moment(this.state.gapCertificate.valid_until).local().format('DD-MMM-YYYY')}</td></tr>
                                                <tr><td>인증품목명</td><td>:</td><td style={{color: '#007bff'}}>{this.state.gapCertificate.certified_product_name}</td></tr>
                                                <tr><td>주소</td><td>:</td><td style={{color: '#007bff'}}>{this.state.gapCertificate.address}</td></tr>
                                                <tr><td>등록 농가수</td><td>:</td><td style={{color: '#007bff'}}>{this.state.gapCertificate.farmer_registration_number}</td></tr>
                                                <tr><td>등록 필지수</td><td>:</td><td style={{color: '#007bff'}}>{this.state.gapCertificate.parcel_registration_number}</td></tr>
                                                <tr><td>재배면적</td><td>:</td><td style={{color: '#007bff'}}>{this.state.gapCertificate.cultivated_area}</td></tr>
                                                <tr><td>생산계획량</td><td>:</td><td style={{color: '#007bff'}}>{this.state.gapCertificate.production_plan}</td></tr>
                                                <tr><td>지정일자</td><td>:</td><td style={{color: '#007bff'}}>{moment(this.state.gapCertificate.created_date).local().format('DD-MMM-YYYY')}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Modal GAP Cert */}
            </div>
        )
    }
}