import { Link, useLocation } from "react-router-dom";

function Navigation({ token }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="main-container">
      <nav className="navbar-container">
        <div className="nav-container">
          <div className="nav-logo">
            <h1 className="auth-system-heading">Auth System</h1>
          </div>

          <ul className="nav-links">
            {!token && (
              <>
                <li>
                  <Link
                    to="/register"
                    className={`nav-link ${location.pathname === "/register" ? "active" : ""}`}
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
            {token && (
              <>
                <li>
                  <Link
                    to="/products"
                    className={`nav-link ${location.pathname === "/products" ? "active" : ""}`}
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
