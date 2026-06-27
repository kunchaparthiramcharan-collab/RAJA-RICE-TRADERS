import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Page Components
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Processing from './pages/Processing';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

// Customer Pages
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import CustomerDashboard from './pages/CustomerDashboard';

// Admin Route Protection
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="pt-32 text-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2E7D32] mx-auto"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Customer Route Protection
const CustomerProtectedRoute = ({ children }) => {
  const { isCustomerAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="pt-32 text-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2E7D32] mx-auto"></div>
      </div>
    );
  }

  return isCustomerAuthenticated ? children : <Navigate to="/customer-login" replace />;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/20 text-gray-800">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          
          {/* Customer Auth Pages */}
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/customer-register" element={<CustomerRegister />} />
          
          {/* Protected Customer Dashboard */}
          <Route 
            path="/customer-dashboard" 
            element={
              <CustomerProtectedRoute>
                <CustomerDashboard />
              </CustomerProtectedRoute>
            } 
          />
          
          {/* Protected Admin Route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect any other path to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
