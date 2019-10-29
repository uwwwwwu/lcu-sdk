import React from 'react';

export default class Cooperative extends React.Component {
    componentDidMount() {
        this.props.setPageTitle('Cooperative');
    }
    render() {
        return (
            <div className="col-md-12 col-lg-8 col-xl-8">
                <div className="items">
                    <div className="product">
                        <div className="row justify-content-center align-items-center">
                            <div className="col">
                                <div className="product-image"><img className="img-fluid d-block mx-auto image" alt='logo' src="assets/img/Cooperative.png" style={{ width: '696px' }} /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}