// shows an error message when the user tries to access a page that doesn't exist

import React from 'react';
import { Link } from 'react-router-dom';

const InvalidPage = () => {
    const goToHomePage = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/";
    }
    return (
        <div className="container text-center">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>Sorry, the page you're looking for doesn't exist</p>
            <Link to="/">
                <button variant="primary" onClick={goToHomePage}>Go Home</button>
            </Link>
        </div>
    );
}

export default InvalidPage;