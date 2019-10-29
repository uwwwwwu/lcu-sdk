import React from 'react';

export default class UserCard extends React.Component {
    render() {
        return (
            <div className="col-md-12 col-lg-4" style={{minHeight: 500}}>
                <div className="summary" style={{ backgroundColor: 'rgb(236,242,230)' }}>
                    <h3>Summary</h3>
                    <h4 style={{ borderTop: 'none' }}><span className="text">ID:</span><span className="price">kokpheng</span></h4>
                    <h4><span className="text">Belong to:</span><span className="price">충북대 생협<br /></span></h4>
                    <button className="btn btn-secondary btn-block btn-lg" type="button">Logout</button>
                </div>
            </div>
        )
    }
}