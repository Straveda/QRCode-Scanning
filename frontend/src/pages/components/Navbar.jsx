function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <h2 className="navbar-title">Straveda Product Portal</h2>
      <div className="navbar-actions">
        <span className="navbar-role">{user?.role?.toUpperCase()}</span>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
