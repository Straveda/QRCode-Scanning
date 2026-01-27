import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-logo-link">
        <h2 className="navbar-title">SMIDI Product Portal</h2>
      </Link>
      <div className="navbar-actions">
        <span className="navbar-role">{user?.role?.toUpperCase()}</span>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
