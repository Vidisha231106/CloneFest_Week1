import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for token on component mount and when location changes
  useEffect(() => {
    const checkAuthStatus = () => {
      if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
      }
    };
    
    checkAuthStatus();
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/');
      // Force a refresh to update the entire app state
      window.location.reload();
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-purple-900/30 border-b border-purple-500/20' 
        : 'bg-slate-900/80 backdrop-blur-lg border-b border-purple-500/10'
    }`}>
      <nav className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link 
            to="/" 
            className="text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-purple-300 to-purple-600 bg-clip-text hover:from-purple-500 hover:via-purple-400 hover:to-purple-700 transition-all duration-300 tracking-wide"
          >
            My Awesome Site
          </Link>

          {/* SearchBar for desktop */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`relative px-1 py-2 font-semibold transition-all duration-300 ${
                isActive('/') 
                  ? 'text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-purple-400 after:to-purple-600 after:rounded-full' 
                  : 'text-gray-300 hover:text-purple-400'
              }`}
            >
              Latest Blogs
            </Link>
            <Link 
              to="/about" 
              className={`relative px-1 py-2 font-semibold transition-all duration-300 ${
                isActive('/about') 
                  ? 'text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-purple-400 after:to-purple-600 after:rounded-full' 
                  : 'text-gray-300 hover:text-purple-400'
              }`}
            >
              About
            </Link>
            <Link 
              to="/categories" 
              className={`relative px-1 py-2 font-semibold transition-all duration-300 ${
                isActive('/categories') 
                  ? 'text-purple-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-purple-400 after:to-purple-600 after:rounded-full' 
                  : 'text-gray-300 hover:text-purple-400'
              }`}
            >
              Categories
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/create-post" 
                  className={`px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 hover:from-purple-700 hover:via-purple-800 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-900/40 hover:shadow-xl hover:shadow-purple-900/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 ${
                    isActive('/create-post') ? 'ring-2 ring-purple-400/50' : ''
                  }`}
                >
                  Create Post
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-300 hover:text-purple-400 font-semibold transition-all duration-300 hover:bg-purple-500/10 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 hover:from-purple-700 hover:via-purple-800 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-900/40 hover:shadow-xl hover:shadow-purple-900/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 ${
                  isActive('/login') ? 'ring-2 ring-purple-400/50' : ''
                }`}
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-3 rounded-xl hover:bg-purple-500/20 transition-all duration-300 border border-purple-500/20 hover:border-purple-400/40"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-6 border-t border-purple-500/20 bg-slate-900/95 backdrop-blur-xl rounded-b-2xl mx-4 -mx-4">
            {/* SearchBar for mobile */}
            <div className="py-6 px-6">
              <SearchBar />
            </div>
            
            <div className="flex flex-col space-y-3 px-6">
              <Link
                to="/"
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive('/') 
                    ? 'text-purple-300 bg-purple-500/20 border border-purple-400/30' 
                    : 'text-gray-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Latest Blogs
              </Link>
              <Link
                to="/about"
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive('/about') 
                    ? 'text-purple-300 bg-purple-500/20 border border-purple-400/30' 
                    : 'text-gray-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/categories"
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive('/categories') 
                    ? 'text-purple-300 bg-purple-500/20 border border-purple-400/30' 
                    : 'text-gray-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>

              {isLoggedIn ? (
                <>
                  <Link
                    to="/create-post"
                    className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      isActive('/create-post') 
                        ? 'text-purple-300 bg-purple-500/20 border border-purple-400/30' 
                        : 'text-gray-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Post
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-xl text-gray-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20 font-semibold transition-all duration-300 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive('/login') 
                      ? 'text-purple-300 bg-purple-500/20 border border-purple-400/30' 
                      : 'text-gray-300 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;