import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  // Admin State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Customer State
  const [customerUser, setCustomerUser] = useState(null);
  const [customerToken, setCustomerToken] = useState(localStorage.getItem('customerToken') || null);
  const [isCustomerAuthenticated, setIsCustomerAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);

  // Synchronize authentication tokens
  useEffect(() => {
    // 1. Check Admin token
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          logout();
        } else {
          setUser({ username: payload.username, id: payload.id });
          setIsAuthenticated(true);
        }
      } catch (e) {
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }

    // 2. Check Customer token
    if (customerToken) {
      try {
        const payload = JSON.parse(atob(customerToken.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          customerLogout();
        } else {
          setCustomerUser({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            phone: payload.phone
          });
          setIsCustomerAuthenticated(true);
        }
      } catch (e) {
        customerLogout();
      }
    } else {
      setIsCustomerAuthenticated(false);
      setCustomerUser(null);
    }

    setLoading(false);
  }, [token, customerToken]);

  // Admin Auth Actions
  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
      });

      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('adminToken', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Admin Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Customer Auth Actions
  const customerLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/customer/login`, {
        email,
        password
      });

      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('customerToken', receivedToken);
      setCustomerToken(receivedToken);
      setCustomerUser(receivedUser);
      setIsCustomerAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Customer Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Check your email and password.'
      };
    }
  };

  const customerRegister = async (name, phone, email, password) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/customer/register`, {
        name,
        phone,
        email,
        password
      });
      return { success: true };
    } catch (error) {
      console.error('Customer Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try again.'
      };
    }
  };

  const customerLogout = () => {
    localStorage.removeItem('customerToken');
    setCustomerToken(null);
    setCustomerUser(null);
    setIsCustomerAuthenticated(false);
  };

  // Axios helper containing whichever token is active
  const authenticatedRequest = () => {
    // If making customer requests, prioritizes customer token; else admin token
    const activeToken = customerToken || token;
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: activeToken ? `Bearer ${activeToken}` : ''
      }
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      customerUser,
      customerToken,
      isCustomerAuthenticated,
      loading,
      login,
      logout,
      customerLogin,
      customerRegister,
      customerLogout,
      api: authenticatedRequest()
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
