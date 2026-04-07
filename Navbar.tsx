import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-white/5 px-[5%] h-[68px] flex items-center justify-between">
      <Link to="/" className="font-display font-extrabold text-2xl tracking-tighter">
        <span className="text-grad">Shikhar</span>
        <span className="text-accent-2">PS</span>
      </Link>

      {/* Desktop Nav */}
      <ul className="hidden md:flex gap-8 list-none">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`text-[0.92rem] font-medium transition-colors hover:text-white ${
                location.pathname === link.path ? 'text-white' : 'text-muted'
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <Link
            to="/profile"
            className="flex items-center gap-2 text-muted hover:text-white transition-colors"
          >
            {user.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-6 h-6 rounded-full object-cover border border-white/10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User size={20} />
            )}
            <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="bg-background-grad text-white px-5 py-2 rounded-full text-sm font-bold font-display hover:opacity-90 transition-opacity"
          >
            Get Free Access
          </Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <button className="md:hidden text-text" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[68px] left-0 right-0 bg-bg/95 backdrop-blur-2xl border-b border-white/5 p-8 flex flex-col gap-6 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-semibold ${
                  location.pathname === link.path ? 'text-accent' : 'text-text'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="text-lg font-semibold text-accent"
              >
                Profile
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-lg font-semibold text-accent"
              >
                Get Free Access
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
