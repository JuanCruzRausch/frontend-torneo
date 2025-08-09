'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../redux/hooks';
import { getMe } from '../redux/slices/authSlice';
import { useAppDispatch } from '../redux/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'user',
  fallback 
}: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('ProtectedRoute: Checking auth...', { user, isAuthenticated, isLoading });
        
        // If we have a token but no user, try to get user info
        if (localStorage.getItem('token') && !user) {
          console.log('ProtectedRoute: Token found but no user, calling getMe...');
          await dispatch(getMe()).unwrap();
        }

        // If no token, redirect to login
        if (!localStorage.getItem('token')) {
          console.log('ProtectedRoute: No token found, redirecting to login');
          router.push('/login');
          return;
        }

        // Wait a bit for the state to be properly updated
        setTimeout(() => {
          console.log('ProtectedRoute: Setting isChecking to false');
          setIsChecking(false);
        }, 100);
      } catch (error) {
        console.error('ProtectedRoute: Auth check error:', error);
        // If getMe fails, clear token and redirect to login
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
    };

    checkAuth();
  }, [dispatch, router, user]);

  // Show loading while checking authentication
  if (isLoading || isChecking) {
    console.log('ProtectedRoute: Showing loading, isLoading:', isLoading, 'isChecking:', isChecking);
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute: Not authenticated or no user', { isAuthenticated, user });
    return null;
  }

  // If user doesn't have required role, show access denied instead of redirecting
  if (requiredRole === 'admin' && user.rol !== 'admin') {
    console.log('ProtectedRoute: User does not have admin role', { userRol: user.rol, requiredRole });
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta página.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Tu rol actual es: <span className="font-semibold">{user.rol}</span>
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute: User authenticated and has required role, rendering children');
  // User is authenticated and has required role
  return <>{children}</>;
} 