import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Zap, LogOut, LayoutDashboard, Settings, Key } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/docs', label: 'API Docs' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-blue to-neon-violet flex items-center justify-center shadow-lg group-hover:shadow-neon-blue/30 transition-shadow">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            <span className="gradient-text">API</span>
                            <span className="text-dark-100 ml-0.5">DapzSYZ</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${location.pathname === link.to
                                        ? 'text-neon-blue bg-neon-blue/10'
                                        : 'text-dark-200 hover:text-white hover:bg-white/5'}`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Only show admin nav if already authenticated — no public login link */}
                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/admin"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5
                     ${isAdmin && location.pathname === '/admin'
                                            ? 'text-neon-violet bg-neon-violet/10'
                                            : 'text-dark-200 hover:text-white hover:bg-white/5'}`}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/admin/settings"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5
                     ${location.pathname === '/admin/settings'
                                            ? 'text-green-400 bg-green-400/10'
                                            : 'text-dark-200 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </Link>
                                <Link
                                    to="/admin/apikeys"
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5
                     ${location.pathname === '/admin/apikeys'
                                            ? 'text-yellow-400 bg-yellow-400/10'
                                            : 'text-dark-200 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Key className="w-4 h-4" />
                                    API Keys
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-dark-200 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 flex items-center gap-1.5 ml-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-dark-200 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass-strong border-t border-white/5 animate-slide-down">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${location.pathname === link.to
                                        ? 'text-neon-blue bg-neon-blue/10'
                                        : 'text-dark-200 hover:text-white hover:bg-white/5'}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-dark-200 hover:text-white hover:bg-white/5"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/admin/settings"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-dark-200 hover:text-white hover:bg-white/5"
                                >
                                    Settings
                                </Link>
                                <Link
                                    to="/admin/apikeys"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-dark-200 hover:text-white hover:bg-white/5"
                                >
                                    API Keys
                                </Link>
                                <button
                                    onClick={() => { logout(); setIsOpen(false); }}
                                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
