import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {API_HOST} from '../ApiConfig';

export default class Header extends React.Component {
    onLoginClick() {
        var userId = prompt("Development ONLY!!! Enter User ID");
        if (userId === null) {
            return;
        }
        if (userId === '') {
            return;
        }
        if (userId !== null || userId !== '') { 
            axios.get(API_HOST + '/user/' + userId).then(res => {
                if (res.data.status) {
                    alert('Success! Login as ' + res.data.data.name);
                    localStorage.setItem('userId', userId);
                    localStorage.setItem('username', res.data.data.name);
                    window.location.reload();
                } else {
                    alert(res.data.error)
                }
            }).catch(e => {
                console.log(e);
            })
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