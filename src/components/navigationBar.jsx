import React from 'react';
function NavBar(){
return(
<div>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
      {/* the button is only used when the screen is smaller than lg */}
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
          <a className="nav-link" href="/login">Log In</a>
          </li>
          <li className="nav-item">
          <a className="nav-link" href="/signup">Sign Up</a>
          </li>
          <li className="nav-item">
          <a className="nav-link" href="/about">About</a>
          </li>
        </ul>
      </div>
      </nav>
</div>

)
}

export default NavBar;