import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/api";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CheckCircle, MailCheck } from "lucide-react";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await verifyEmail({ email, code });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1800);
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
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center">
        <Card className="w-full text-center">
          <CardHeader>
            <CardTitle>No email provided</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Please register first so we know where to send your verification
              code.
            </p>
            <Button asChild>
              <Link to="/register">Go to register</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center">
      <Card className="w-full">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <p className="text-sm text-muted-foreground">
            We sent a verification code to{" "}
            <span className="font-semibold">{email}</span>
          </p>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="flex items-start gap-3 border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <AlertDescription>
                Email verified successfully. Redirecting you to sign in...
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="code">Verification code</Label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter the 6-digit code"
                  required
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify email"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
