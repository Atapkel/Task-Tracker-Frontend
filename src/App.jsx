import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';
// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Reminders from './pages/Reminders';

/*
 * APP COMPONENT
 * Root component that sets up routing and providers
 */
function App() {
  return (
    /*
     * BROWSER ROUTER
     * Enables client-side routing (no page reloads)
     * Uses HTML5 History API
     */
    <Router>
      {/*
       * AUTH PROVIDER
       * Wraps entire app to provide authentication state
       * Must be inside Router to use navigation
       */}
      <AuthProvider>
        {/* Main Layout */}
        <div className="min-h-screen bg-gray-100">
          {/* Navigation - shown on all pages */}
          <Navbar />

          {/* Main Content Area */}
          <main>
            {/*
             * ROUTES
             * Define which component renders for each URL path
             */}
            <Routes>
              {/* Public Routes - accessible to everyone */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

              {/* Protected Routes - require authentication */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reminders"
                element={
                  <ProtectedRoute>
                    <Reminders />
                  </ProtectedRoute>
                }
              />

              {/* Default Route - redirect to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* 404 - Catch all unknown routes */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                      <p className="text-gray-600 mb-4">Page not found</p>
                      <a
                        href="/dashboard"
                        className="text-blue-600 hover:text-blue-500"
                      >
                        Go to Dashboard
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;