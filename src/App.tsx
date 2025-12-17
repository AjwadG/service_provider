import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout/Layout';
import { AuthGuard } from './components/Auth/AuthGuard';
import { HomePage } from './components/Home/HomePage';
import { LoginPage } from './components/Auth/LoginPage';
import { RegisterPage } from './components/Auth/RegisterPage';
import { ServicesPage } from './components/Services/ServicesPage';
import { ProvidersPage } from './components/Providers/ProvidersPage';
import { ProviderDetailPage } from './components/Providers/ProviderDetailPage';
import { DashboardPage } from './components/Dashboard/DashboardPage';
import { ChatPage } from './components/Chat/ChatPage';
import { BookingsPage } from './components/Bookings/BookingsPage';
import { ProfilePage } from './components/Profile/ProfilePage';
import { AdminPage } from './components/Admin/AdminPage';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes with layout */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/providers" element={<ProvidersPage />} />
                  <Route path="/provider/:id" element={<ProviderDetailPage />} />
                  <Route path="/dashboard" element={
                    <AuthGuard>
                      <DashboardPage />
                    </AuthGuard>
                  } />
                  <Route path="/chat" element={
                    <AuthGuard>
                      <ChatPage />
                    </AuthGuard>
                  } />
                  <Route path="/bookings" element={
                    <AuthGuard>
                      <BookingsPage />
                    </AuthGuard>
                  } />
                  <Route path="/profile" element={
                    <AuthGuard>
                      <ProfilePage />
                    </AuthGuard>
                  } />
                  <Route path="/admin" element={
                    <AuthGuard requiredRole="admin">
                      <AdminPage />
                    </AuthGuard>
                  } />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;