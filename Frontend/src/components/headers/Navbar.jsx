import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthContext } from '../../ultilities/providers/AuthProvider'
import Swal from 'sweetalert2'
import useUser from '../../hooks/useUser'

const navLinks = [
  { name: 'Explore Classes', route: '/classes' },
  { name: 'Instructors', route: '/instructors' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNavGetStarted, setShowNavGetStarted] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const { currentUser } = useUser();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.pageYOffset > 60);

      if (isHome) {
        const heroBtn = document.getElementById('hero-get-started');
        if (heroBtn) {
          const rect = heroBtn.getBoundingClientRect();
          // Show navbar button only after the hero button scrolls out of view
          setShowNavGetStarted(rect.bottom <= 64);
        } else {
          setShowNavGetStarted(window.pageYOffset > 350);
        }
      } else {
        setShowNavGetStarted(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome, location.pathname]);

  // Close mobile menu on route change
  useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Log out?',
      text: "You'll need to sign back in.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#12B8A6',
      cancelButtonColor: '#667085',
      confirmButtonText: 'Yes, log out',
    }).then((result) => {
      if (result.isConfirmed) {
        logout()
          .then(() => navigate('/'))
          .catch((err) => Swal.fire('Error', err.message, 'error'));
      }
    });
  };

  // Background logic
  const isTransparent = isHome && !scrolled;
  const navBgClass = isTransparent
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-md border-b border-[#DDE3EA] shadow-sm';

  const linkClass = isTransparent ? 'text-white hover:text-teal' : 'text-text-primary hover:text-teal';
  const logoClass = isTransparent ? 'text-white' : 'text-navy';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${navBgClass} fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 12H8v-1c0-2.21 3.58-4 4-4s4 1.79 4 4v1z" fill="white" />
              </svg>
            </div>
            <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${logoClass}`}>
              Yoga Master
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.route}
                to={link.route}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'text-teal bg-teal-100'
                    : linkClass
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop auth / user area */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-semibold px-4 py-2 rounded-btn transition-colors duration-200 ${isTransparent ? 'text-white hover:text-teal' : 'text-text-primary hover:text-teal'
                    }`}
                >
                  Sign In
                </Link>
                <AnimatePresence>
                  {showNavGetStarted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        to="/onboarding"
                        className="text-sm font-bold px-5 py-2 bg-teal text-white rounded-btn hover:bg-teal-600 transition-colors duration-200 inline-block shadow-sm"
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `text-sm font-semibold px-3 py-2 rounded-lg transition-colors duration-200 ${isActive ? 'text-teal' : linkClass
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <Link
                  to="/dashboard/profile"
                  title="Profile & Settings"
                  aria-label="Profile & Settings"
                  className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-teal"
                >
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser?.name || "Profile"}
                      className="w-9 h-9 rounded-full object-cover border-2 border-border-ui hover:border-teal transition-all"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full bg-teal text-white flex items-center justify-center text-sm font-bold hover:bg-teal-600 transition-colors"
                    >
                      {currentUser?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold px-4 py-2 border border-border-ui rounded-btn text-border-ui hover:border-teal hover:text-teal transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-border-ui overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.route}
                  to={link.route}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'bg-teal-100 text-teal' : 'text-text-primary hover:bg-surface-2'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-2 border-t border-border-ui mt-2 flex flex-col gap-2">
                {!user ? (
                  <>
                    <Link to="/login" className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-text-primary hover:bg-surface-2">Sign In</Link>
                    <Link to="/onboarding" className="block px-3 py-2.5 rounded-lg text-sm font-bold bg-teal text-white text-center">Get Started</Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-text-primary hover:bg-surface-2">Dashboard</Link>
                    <Link to="/dashboard/profile" className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-teal hover:bg-teal-100/50">Profile & Settings</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-error hover:bg-red-50">Logout</button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
