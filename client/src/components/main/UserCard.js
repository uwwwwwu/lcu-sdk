import React from 'react';

export default class UserCard extends React.Component {
    onLogoutClick() {
        if (localStorage.getItem('userId') === null) {
            return;
        }
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        window.location.reload();
    }

    render() {
        let user = localStorage.getItem('userId') === null ? 'Not Login' : localStorage.getItem('username') + ' (' + localStorage.getItem('userId') + ')'
        return (
            <div className="col-md-12 col-lg-4" style={{minHeight: 500}}>
                <div className="summary" style={{ backgroundColor: 'rgb(236,242,230)' }}>
                    <h3>회원정보</h3>
                    <h4 style={{ borderTop: 'none' }}><span className="text">ID:</span><span className="price">{user}</span></h4>
                    <h4><span className="text">소속:</span><span className="price">충북대 생협<br /></span></h4>
                    <button onClick={this.onLogoutClick} className="btn btn-secondary btn-block btn-lg" type="button">로그아웃</button>
                </div>
            </div>
        )
    }
}
