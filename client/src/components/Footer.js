import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
            <footer className="page-footer dark">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-3">
                            <h5>Get started</h5>
                            <ul>
                                <li><a href="/">Home</a></li>
                                <li><a href="/products">Product</a></li>
                            </ul>
                        </div>
                        <div className="col-sm-3">
                            <h5>About us</h5>
                            <ul>
                                <li><a href="/">Contact us</a></li>
                            </ul>
                        </div>
                        <div className="col-sm-3">
                            <h5>Support</h5>
                            <ul>
                                <li><a href="/">FAQ</a></li>
                            </ul>
                        </div>
                        <div className="col-sm-3">
                            <h5>Legal</h5>
                            <ul>
                                <li><a href="/">Terms of Service</a></li>
                                <li><a href="/">Terms of Use</a></li>
                                <li><a href="/">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-copyright">
                    <p>© 2019 Copyright CBNU</p>
                </div>
            </footer>
        )
    }
}