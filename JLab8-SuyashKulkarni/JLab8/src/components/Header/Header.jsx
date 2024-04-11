// Header.jsx
import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <header>
            <nav class="navbar">
                <h2 class="navbar-title">Trivia</h2>
                <ul class="navbar-links">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
