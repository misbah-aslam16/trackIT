import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, logout, user }) => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <i className="fas fa-chart-line" style={{ marginRight: '10px' }}></i>
        TrackIt Management System
      </Link>
      <div className="navbar-nav">
        {isAuthenticated ? (
          <>
            <span className="nav-link" style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '15px',
              backgroundColor: '#f0f4f8',
              padding: '8px 15px',
              borderRadius: '20px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <i className="fas fa-user-circle" style={{ marginRight: '8px', fontSize: '1.2rem', color: '#3498db' }}></i>
              {user?.name}
            </span>
            <button onClick={logout} className="btn btn-danger" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '20px',
              padding: '8px 16px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className="fas fa-sign-in-alt"></i> Login
            </Link>
            <Link to="/register" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <i className="fas fa-user-plus"></i> Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
