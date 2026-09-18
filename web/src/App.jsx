import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Plus } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppRoutes from './routes';
import GlareHover from './components/GlareHover';
import LoadingSpinner from './components/shared/LoadingSpinner';
import logo from './lib/logo-removebg.png';

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    const handleOnline = () => { toast.dismiss('offline'); toast.success('Back online'); };
    const handleOffline = () => toast.error('You are offline', { duration: Infinity, id: 'offline' });
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    if (!navigator.onLine) handleOffline();
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" style={{ position: 'relative', zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to={user ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src={logo} alt="Darukaa.Earth Logo" style={{ height: '32px' }} />
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <GlareHover background="var(--color-primary)" style={{ borderRadius: '9999px' }}>
          <button 
            onClick={() => navigate('/projects/new')} 
            className="btn" 
            style={{ width: '100%', height: '100%', padding: '8px 16px', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'white' }}
          >
            <Plus size={16} /> Add Project
          </button>
        </GlareHover>
        
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              border: 'none', cursor: 'pointer', padding: 0, fontWeight: '600', fontSize: '16px'
            }}
          >
            {user.email.charAt(0).toUpperCase()}
          </button>
          
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'white', borderRadius: 'var(--radius)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  padding: '20px', width: '280px', boxSizing: 'border-box', zIndex: 100,
                  border: '1px solid #e5e7eb'
                }}
              >
                {/* Arrow Caret */}
                <div style={{ position: 'absolute', top: '-6px', right: '16px', width: '12px', height: '12px', background: 'white', transform: 'rotate(45deg)', borderLeft: '1px solid #e5e7eb', borderTop: '1px solid #e5e7eb' }} />
                
                <p style={{ margin: '0 0 16px 0', color: 'var(--color-text-muted)', fontSize: '14px', wordBreak: 'break-all', position: 'relative', zIndex: 2 }}>
                  {user.email}
                </p>
                <div className="logout-btn-container" style={{ width: '100%', boxSizing: 'border-box' }}>
                  <motion.button 
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogout}
                    style={{
                      width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      background: '#DC2626', color: 'white', border: 'none', padding: '10px 16px',
                      borderRadius: '9999px', cursor: 'pointer', fontWeight: '500', fontSize: '15px', margin: 0
                    }}
                    className="logout-btn"
                  >
                    Logout <LogOut size={16} className="logout-icon" style={{ transition: 'transform 0.2s ease' }} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-primary)', color: '#B7E4C7', padding: '16px', textAlign: 'center', marginTop: 'auto', position: 'relative', zIndex: 10 }}>
      <p style={{ margin: 0, fontSize: '14px' }}>© 2026 Darukaa.Earth — Hackathon Submission</p>
    </footer>
  );
}

function AppContent() {
  const { loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--color-bg)' }}>
        <LoadingSpinner text="Authenticating..." />
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: 'var(--radius)',
            fontFamily: 'inherit',
            fontSize: '14px',
            fontWeight: '500',
            color: 'white',
          },
          success: {
            style: {
              background: 'var(--color-primary)',
            },
            iconTheme: {
              primary: 'var(--color-accent-lime)',
              secondary: 'var(--color-primary)',
            },
          },
          error: {
            style: {
              background: '#DC2626',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#DC2626',
            },
          }
        }} 
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
        >
          <AppRoutes location={location} />
        </motion.div>
      </AnimatePresence>
      {location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register' && (
        <Footer />
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="app-container">
          <AppContent />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
