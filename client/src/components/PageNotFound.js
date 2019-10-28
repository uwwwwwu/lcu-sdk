import React from 'react';
import { Link } from 'react-router-dom';

export default class PageNotFound extends React.Component {
    render() {
        return(
            <div>
                <h4>404 Page not found</h4>
                <h6><Link to='/'>Back to homepage</Link></h6>
            </div>
        )
    }
}