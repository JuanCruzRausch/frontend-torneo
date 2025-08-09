'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <nav className="bg-gray-800 shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Torneo Misionero" 
                className="w-18 h-18 object-contain"
              />
              <span className="text-xl font-bold text-white-900">Torneo Misionero</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/torneos" className="text-white-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Torneos
            </Link>
            <Link href="/goleadores" className="text-white-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Goleadores
            </Link>
            <Link href="/reglamento" className="text-white-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Reglamento
            </Link>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Admin
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Hola, {user?.nombre}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 text-sm font-medium transition-colors"
                  >
                    Salir
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-4">
            <div className="space-y-2">
              <Link href="/torneos" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Torneos
              </Link>
              <Link href="/goleadores" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Goleadores
              </Link>
              <Link href="/reglamento" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Reglamento
              </Link>

              {isAuthenticated ? (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <Link href="/admin" className="block bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                    Admin
                  </Link>
                  <div className="px-3 py-2">
                    <span className="text-sm text-gray-700">Hola, {user?.nombre}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-200">
                  <Link href="/login" className="block bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                    Iniciar Sesión
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 