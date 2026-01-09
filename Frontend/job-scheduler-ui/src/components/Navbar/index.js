import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav>
        <div class="nav__header">
          <div class="nav__logo">
            <Link to="/" class="logo">
              Job<span>Hunt</span>
            </Link>
          </div>
          <div class="nav__menu__btn" id="menu-btn">
            <i class="ri-menu-line"></i>
          </div>
        </div>
        <ul class="nav__links" id="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jobs">jobs</Link>
          </li>
          <li>
            <button class="btn">Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
