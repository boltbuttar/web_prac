import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Student Pages
import Dashboard from './pages/student/Dashboard';
import BookSession from './pages/student/BookSession';
import Sessions from './pages/student/Sessions';
import Reviews from './pages/student/Reviews';
import Wishlist from './pages/student/Wishlist';
import Chat from './pages/student/Chat';

// Tutor Pages
import TutorDashboard from './pages/tutor/Dashboard';
import TutorProfile from './pages/tutor/Profile';
import TutorSessions from './pages/tutor/Sessions';
import TutorReviews from './pages/tutor/Reviews';
import ProfileManagement from './pages/tutor/ProfileManagement';
import SessionManagement from './pages/tutor/SessionManagement';

// Common Pages
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <PrivateRoute role="student">
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/sessions/book/:tutorId"
              element={
                <PrivateRoute role="student">
                  <BookSession />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/sessions"
              element={
                <PrivateRoute role="student">
                  <Sessions />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/reviews"
              element={
                <PrivateRoute role="student">
                  <Reviews />
                </PrivateRoute>
              }
            />
            <Route
              path="/student/wishlist"
              element={
                <PrivateRoute role="student">
                  <Wishlist />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat/:tutorId"
              element={
                <PrivateRoute role="student">
                  <Chat />
                </PrivateRoute>
              }
            />

            {/* Tutor Routes */}
            <Route
              path="/tutor/dashboard"
              element={
                <PrivateRoute role="tutor">
                  <TutorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/tutor/profile"
              element={
                <PrivateRoute role="tutor">
                  <ProfileManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/tutor/sessions"
              element={
                <PrivateRoute role="tutor">
                  <SessionManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/tutor/reviews"
              element={
                <PrivateRoute role="tutor">
                  <TutorReviews />
                </PrivateRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 