import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, User, Bookmark, LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="atv-nav fixed top-0 w-full z-50 border-b border-white/[0.04]" data-testid="header">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2" data-testid="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#F5F5F7"/><path d="M7 8.5C7 7.67 7.67 7 8.5 7h7c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-7c-.83 0-1.5-.67-1.5-1.5v-7z" fill="#000"/><path d="M10.5 9.5l4 2.5-4 2.5v-5z" fill="#F5F5F7"/></svg>
            <span className="text-lg font-bold tracking-tight text-[#F5F5F7]" style={{ fontFamily: 'Inter, sans-serif' }}>
              CineVerse
            </span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors" data-testid="nav-home">Home</Link>
              <Link to="/search" className="text-sm text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors" data-testid="nav-discover">Discover</Link>
              <Link to="/watchlist" className="text-sm text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors" data-testid="nav-watchlist">Watchlist</Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/search" className="md:hidden p-2 text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors" data-testid="search-nav-button">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              <Link to="/watchlist" className="md:hidden p-2 text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors" data-testid="watchlist-nav-button">
                <Bookmark className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white"
                  data-testid="user-menu-button"
                >
                  {user.name?.charAt(0).toUpperCase()}
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-52 atv-glass rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl" data-testid="user-menu">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-sm font-semibold text-[#F5F5F7]">{user.name}</p>
                      <p className="text-xs text-[#86868B] truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={async () => { await logout(); navigate('/login'); setShowMenu(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-[#A1A1A6] hover:text-[#F5F5F7] hover:bg-white/[0.04] transition-colors flex items-center gap-2"
                      data-testid="logout-button"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={1.5} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors px-3 py-1.5" data-testid="login-nav-button">
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-black bg-[#F5F5F7] hover:bg-white px-4 py-1.5 rounded-full transition-all"
                data-testid="register-nav-button"
              >
                Try Free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
