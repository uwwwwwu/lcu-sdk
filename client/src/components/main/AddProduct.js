import React from 'react';
import axios from 'axios';

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
            amount: ''
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

    onInputFileChanged(event) {
        var file = this.refs.inputFile.files[0];
        if (file==null) {
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
        const formData = new FormData();
        formData.append('image', this.state.imageFile);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("http://master:8081/upload", formData, config).then((res) => {
            console.log(res.data)
            if (res.data.status) {
                var imageUrl = res.data.data;

                axios.post('http://master:8081/add-product', {
                    supplierId: "cl",
                    productId: this.state.productId,
                    productName: this.state.productName,
                    farmhouse: this.state.farmhouse,
                    price: this.state.price,
                    verifiedBy: "CBNU Coop",
                    amount: this.state.amount,
                    image: imageUrl
                }).then(res => {
                    console.log(res.data)
                    if (res.data.status) {
                        alert(res.data.message)
                    } else {
                        console.log(res.data.error)
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
                                            <input type="text" className="form-control" id="name" value={this.state.productId} onChange={this.onProductIdChanged.bind(this)} placeholder='Product ID' />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="name" className="col-sm-3 col-form-label">Name</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="name" value={this.state.productName} onChange={this.onProductNameChanged.bind(this)} placeholder='Product Name' />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="farmhouse" className="col-sm-3 col-form-label">Farmhouse</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="farmouse" value={this.state.farmhouse} onChange={this.onFarmHouseChanged.bind(this)} placeholder='Farmhouse' />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="price" className="col-sm-3 col-form-label">Price</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="price" value={this.state.price} onChange={this.onPriceChanged.bind(this)} placeholder='Price' />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="amount" className="col-sm-3 col-form-label">Amount</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="amount" value={this.state.amount} onChange={this.onAmountChanged.bind(this)} placeholder="Amount" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="row no-gutters">
                            <div className="col-md-7 col-lg-7">
                                <div className="items" style={{ backgroundColor: 'rgb(247,251,255)' }}>
                                    <div className="products">
                                        <h4 className="title">Certificate Status</h4>
                                        <div className="item">
                                            <span className="price" style={{ fontWeight: 'bold' }}>Checked by:</span> CBNU Coop <i style={{ color: 'green' }} className="icon-check icon"></i>
                                        </div>
                                        <div className="item">
                                            <span className="price" style={{ fontWeight: 'bold' }}>GAP Certificate </span> <i style={{ color: 'green' }} className="icon-check icon"></i>
                                        </div>
                                        <div className="item">
                                            <span className="price" style={{ fontWeight: 'bold' }}>Environment-friendly Certificate </span> <i style={{ color: 'green' }} className="icon-check icon"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5 col-lg-5">
                                <div className="summary">
                                    <button className="btn btn-primary btn-block btn-lg" type="submit"><strong>Add Product</strong></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}