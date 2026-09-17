import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectMap from './pages/ProjectMap';
import SiteDetail from './pages/SiteDetail';

function Navigation() {
  const { user, logout } = useAuth();
  
  return (
    <nav className="navbar">
      <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#10b981' }}>
        Darukaa.Earth
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <span style={{ marginLeft: '1rem', color: '#6b7280' }}>{user.email}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <Navigation />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects/:id/map" element={<ProtectedRoute><ProjectMap /></ProtectedRoute>} />
            <Route path="/sites/:id" element={<ProtectedRoute><SiteDetail /></ProtectedRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
