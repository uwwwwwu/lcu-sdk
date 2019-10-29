import React from 'react';

import {Link} from 'react-router-dom';

export default class Header extends React.Component {
    onLoginClick() {
        var userId = prompt("Enter User ID");
        if (userId !== null || userId !== '') { 
            localStorage.setItem('userId', userId);
        }
    }
    render() {
        return (
            <nav className="navbar navbar-light navbar-expand-lg fixed-top bg-white clean-navbar">
                <div className="container"><img alt='logo' src="assets/img/coop-logo.png" style={{width: '97px'}} /><Link className="navbar-brand logo" to="/">Life-Cooperation Union</Link><button data-toggle="collapse" className="navbar-toggler" data-target="#navcol-1"><span className="sr-only">Toggle navigation</span><span className="navbar-toggler-icon"></span></button>
                    <div
                        className="collapse navbar-collapse" id="navcol-1">
                        <ul className="nav navbar-nav ml-auto">
                            <li className="nav-item" role="presentation"><Link className="nav-link" to="/">Home</Link></li>
                            <li className="nav-item" role="presentation"><Link className="nav-link" to="/add-product">Add Product</Link></li>
                            <li className="nav-item" role="presentation"><p style={{cursor: 'pointer'}} onClick={this.onLoginClick.bind(this)} className="nav-link">Login</p></li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}