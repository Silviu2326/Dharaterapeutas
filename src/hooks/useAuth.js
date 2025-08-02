import { useState, useEffect } from 'react';
import { useAppStore } from '../app/store';

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, setUser, logout } = useAppStore();

  useEffect(() => {
    // Check for existing token in localStorage or sessionStorage
    let token = localStorage.getItem('dhara-token');
    let userData = localStorage.getItem('dhara-user');
    
    // If not in localStorage, check sessionStorage
    if (!token) {
      token = sessionStorage.getItem('dhara-token');
      userData = sessionStorage.getItem('dhara-user');
    }
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('dhara-token');
        localStorage.removeItem('dhara-user');
        sessionStorage.removeItem('dhara-token');
        sessionStorage.removeItem('dhara-user');
      }
    }
    
    setLoading(false);
  }, [setUser]);

  const login = async (credentials) => {
    try {
      // TODO: Implement actual API call
      // For now, simulate a successful login for demo purposes
      const mockUser = {
        id: 1,
        name: 'Dr. María González',
        email: credentials.email,
        role: 'therapist'
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate login validation
      if (credentials.email && credentials.password && credentials.password.length >= 8) {
        // Store token based on rememberMe preference
        if (credentials.rememberMe) {
          localStorage.setItem('dhara-token', mockToken);
          localStorage.setItem('dhara-user', JSON.stringify(mockUser));
        } else {
          sessionStorage.setItem('dhara-token', mockToken);
          sessionStorage.setItem('dhara-user', JSON.stringify(mockUser));
        }
        
        setUser(mockUser);
        return { success: true };
      } else {
        return { success: false, error: 'Credenciales no válidas' };
      }
      
      /* Real API implementation would be:
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store token based on rememberMe preference
        if (credentials.rememberMe) {
          localStorage.setItem('dhara-token', data.token);
          localStorage.setItem('dhara-user', JSON.stringify(data.user));
        } else {
          sessionStorage.setItem('dhara-token', data.token);
          sessionStorage.setItem('dhara-user', JSON.stringify(data.user));
        }
        
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
      */
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('dhara-token');
    localStorage.removeItem('dhara-user');
    sessionStorage.removeItem('dhara-token');
    sessionStorage.removeItem('dhara-user');
    logout();
  };

  const getToken = () => {
    return localStorage.getItem('dhara-token') || sessionStorage.getItem('dhara-token');
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout: logoutUser,
    getToken,
  };
};