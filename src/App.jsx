import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Reminders from "./pages/Reminders";

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
        <div className="min-h-screen bg-background">
          <Navbar />

          <main className="container py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

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

              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center py-16">
                    <Card className="max-w-md w-full">
                      <CardHeader className="text-center">
                        <CardTitle className="text-3xl">404</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-center">
                        <p className="text-muted-foreground">Page not found</p>
                        <Button asChild>
                          <a href="/dashboard">Go to dashboard</a>
                        </Button>
                      </CardContent>
                    </Card>
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
