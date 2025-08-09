'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getMe } from '../redux/slices/authSlice';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is authenticated on app startup
    const token = localStorage.getItem('token');
    
    if (token && !user && !isLoading) {
      console.log('AuthProvider: Token found, fetching user data...');
      dispatch(getMe());
    }
  }, [dispatch, user, isLoading]);

  return <>{children}</>;
} 