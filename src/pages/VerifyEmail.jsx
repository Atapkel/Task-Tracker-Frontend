import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/api";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get email from navigation state (passed from Register page)
  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await verifyEmail({ email, code });
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Verification failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            No email provided
          </h2>
          <p className="text-gray-600 mb-4">
            Please register first to verify your email.
          </p>
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Go to Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 8l7. 89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Verify your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We sent a verification code to <br />
              <span className="font-medium">{email}</span>
            </p>
          </div>

          {/* Success Message */}
          {success ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-center">
              <p className="font-medium">Email verified successfully!</p>
              <p className="text-sm mt-1">Redirecting to login...</p>
            </div>
          ) : (
            /* Verification Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter verification code"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
