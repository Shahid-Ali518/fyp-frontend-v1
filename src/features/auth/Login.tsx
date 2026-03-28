import React, { useState, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTitle } from "@/hooks/useTitle";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface LocationState {
  from?: { pathname: string };
}

const Login: React.FC = () => {
  useTitle("Login");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || "/";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields.");
      setTimeout(() => setError(""), 5000);
      return;
    }

    // TODO: Add login API call
    // navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-hero-bg flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-background rounded-3xl shadow-xl border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center text-coral font-bold text-2xl mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">
            Sign in to continue your mental wellness journey
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-center rounded-lg py-2 mb-4">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent text-foreground bg-background"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-foreground text-sm font-medium">
                Password
              </label>
              <Link
                to="/forgot"
                className="text-coral text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent text-foreground bg-background"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <Button variant="coral" size="lg" className="w-full py-3">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-coral font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;