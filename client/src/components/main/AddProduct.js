import React from 'react';
import axios from 'axios';
import { API_HOST } from '../../ApiConfig';

export default class AddProduct extends React.Component {
    constructor() {
        super();
        this.state = {
            previewImage: 'https://www.turner-biocatalysis.com/wp-content/uploads/2018/12/Placeholder.png',
            imageFile: null,
            productId: '',
            productName: '',
            farmhouse: '',
            price: '',
            amount: '',
            gapCertNum: '',
            envCertNum: '',
            isValidGAP: false,
            gapMessage: 'Enter GAP Certificate Number',
            isValidEnv: false,
            envMessage: 'Enter Environment-friendly Certificate Number'
        }
    }
    componentDidMount() {
        this.props.setPageTitle('Add Product');
    }

    onImageClick(e) {
        this.refs.inputFile.click();
    }

    onProductIdChanged(e) { this.setState({ productId: e.target.value }) }
    onProductNameChanged(e) { this.setState({ productName: e.target.value }) }
    onFarmHouseChanged(e) { this.setState({ farmhouse: e.target.value }) }
    onPriceChanged(e) { this.setState({ price: e.target.value }) }
    onAmountChanged(e) { this.setState({ amount: e.target.value }) }
    onGAPCertNumChanged(e) {
        this.setState({ gapCertNum: e.target.value });
        axios.get(API_HOST + '/gap-certificate/' + e.target.value).then(res => {
            if (res.data.status) {
                if (res.data.is_valid_certificate) {
                    this.setState({ isValidGAP: true, gapMessage: 'Certificate valid until ' + res.data.data.valid_until.slice(0, 10) })
                } else {
                    this.setState({ isValidGAP: false, gapMessage: 'Certificate expired' })
                }
            } else {
                this.setState({ isValidGAP: false, gapMessage: res.data.error })
            }
        }).catch(e => {
            console.log(e)
        })
    }
    onEnvCertNumChanged(e) { this.setState({ envCertNum: e.target.value }) }

    onInputFileChanged(event) {
        var file = this.refs.inputFile.files[0];
        if (file == null) {
            return;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file);

        this.setState({ imageFile: event.target.files[0] })

        reader.onloadend = (e => {
            this.setState({ previewImage: reader.result })
        })
    }

    onFormSubmit(e) {
        e.preventDefault();
        // Check user login & role
        if (localStorage.getItem('userId') === null) {
            alert('Not login!!! Login first ^^');
            return;
        }


        const formData = new FormData();
        formData.append('image', this.state.imageFile);
        const config = { headers: { 'content-type': 'multipart/form-data' } };
        axios.post(API_HOST + "/upload", formData, config).then((res) => {
            console.log(res.data)
            if (res.data.status) {
                var imageUrl = res.data.data;

                axios.post(API_HOST + '/add-product', {
                    supplierId: localStorage.getItem('userId'),
                    productId: this.state.productId,
                    productName: this.state.productName,
                    farmhouse: this.state.farmhouse,
                    price: this.state.price,
                    gapCertNum: this.state.gapCertNum,
                    envCertNum: this.state.envCertNum,
                    amount: this.state.amount,
                    image: imageUrl
                }).then(res => {
                    console.log(res.data)
                    if (res.data.status) {
                        alert(res.data.message)
                    } else {
                        alert(res.data.error)
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                alert(res.data.error)
            }
        }).catch((err) => {
            console.log(err)
        });
    }

    render() {
        return (
            <div className="col-md-12 col-lg-8 col-xl-8">
                <form onSubmit={this.onFormSubmit.bind(this)}>
                    <div className="items" style={{ padding: '30px', paddingBottom: '15px' }}>
                        <h1><strong>충북 보은 생대추</strong></h1>
                    </div>
                    <div className="items" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                        <div className="product">
                            <div className='row'>
                                <div className='col-md-4'>
                                    <img onClick={this.onImageClick.bind(this)} src={this.state.previewImage} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt='thumbnail' />
                                    <input ref='inputFile' style={{ display: 'none' }} type='file' onChange={this.onInputFileChanged.bind(this)} />
                                </div>
                                <div className='col-md-8'>
                                    <div className="form-group row">
                                        <label htmlFor="name" className="col-sm-3 col-form-label">ID</label>
                                        <div className="col-sm-9">
                                            <input type="number" className="form-control" id="name" value={this.state.productId} onChange={this.onProductIdChanged.bind(this)} placeholder='Product ID' required />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="name" className="col-sm-3 col-form-label">Name</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="name" value={this.state.productName} onChange={this.onProductNameChanged.bind(this)} placeholder='Product Name' required />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="farmhouse" className="col-sm-3 col-form-label">Farmhouse</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="farmouse" value={this.state.farmhouse} onChange={this.onFarmHouseChanged.bind(this)} placeholder='Farmhouse' required />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="price" className="col-sm-3 col-form-label">Price</label>
                                        <div className="col-sm-9">
                                            <input type="number" className="form-control" id="price" value={this.state.price} onChange={this.onPriceChanged.bind(this)} placeholder='Price' required />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="amount" className="col-sm-3 col-form-label">Amount</label>
                                        <div className="col-sm-9">
                                            <input type="number" className="form-control" id="amount" value={this.state.amount} onChange={this.onAmountChanged.bind(this)} placeholder="Amount" required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="row no-gutters">
                            <div className="col-md-12 col-lg-12">
                                <div className="items" style={{ backgroundColor: 'rgb(247,251,255)' }}>
                                    <div className="products">
                                        <h4 className="title">Certificate Status</h4>
                                        <div className="form-row">
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="gap-cert">GAP Certificate Number</label>
                                                <input type="text" style={{ backgroundPosition: '97%'}} value={this.state.gapCertNum} onChange={this.onGAPCertNumChanged.bind(this)} className={this.state.isValidGAP ? 'form-control is-valid' : 'form-control is-invalid'} id="gap-cert" placeholder="GAP Certificate Number" required />
                                                <div className={this.state.isValidGAP ? 'valid-feedback' : 'invalid-feedback'}>{this.state.gapMessage}</div>
                                            </div>
                                            <div className="col-md-12 mb-3">
                                                <label htmlFor="env-cert">Environment-friendly Certificate Number (optional)</label>
                                                <input type="text" style={{ backgroundPosition: '97%' }} value={this.state.envCertNum} onChange={this.onEnvCertNumChanged.bind(this)} className={this.state.isValidEnv ? 'form-control is-valid' : 'form-control is-invalid'} id="env-cert" placeholder="Environment-friendly Certificate Number" />
                                                <div className={this.state.isValidEnv ? 'valid-feedback' : 'invalid-feedback'}>{this.state.envMessage}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="summary">
                                        <button className="btn btn-primary btn-block btn-lg" type="submit"><strong>Add Product</strong></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}