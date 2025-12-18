import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    Event<span className="logo-accent">Hub</span>
                </Link>
                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/create-event" className="btn btn-primary">
                                <FaPlus /> Create Event
                            </Link>
                            <div className="user-menu">
                                <span className="user-name"><FaUser /> {user.name}</span>
                                <button onClick={logout} className="btn btn-secondary btn-sm">
                                    <FaSignOutAlt />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
            <style>{`
        .navbar {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 1rem 0;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }
        .logo-accent {
          color: var(--primary-color);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-link {
          color: var(--text-secondary);
          font-weight: 500;
        }
        .nav-link:hover {
          color: white;
        }
        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-left: 1rem;
          border-left: 1px solid rgba(255,255,255,0.1);
        }
        .user-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .btn-sm {
          padding: 0.5rem;
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
