import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Client-side auth utilities
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Protected routes - only protect API routes, not frontend routes
const protectedApiRoutes = ['/api/admin', '/api/equipos', '/api/torneos', '/api/partidos', '/api/jugadores'];
const authRoutes = ['/api/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only apply middleware to API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Check if the route is protected
  const isProtectedRoute = protectedApiRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the route is auth-related
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected API route without token
  if (isProtectedRoute && !token) {
    return NextResponse.json(
      { message: 'Acceso denegado. Token requerido.' },
      { status: 401 }
    );
  }

  // Redirect to admin if already authenticated and trying to access auth routes
  if (isAuthRoute && token) {
    return NextResponse.json(
      { message: 'Ya estás autenticado.' },
      { status: 400 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
}; 