import React, { useState, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTitle } from "@/hooks/useTitle";
import { Button } from "@/components/ui/button";
import { AuthService } from "../../components/services/AuthApiService";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface LocationState {
  from?: { pathname: string };
}

const Signup: React.FC = () => {
  useTitle("Sign Up");

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || "/login";
  const [loading, setLoading] = useState<boolean>(false);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic Validation
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Registration Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please check again.",
        variant: "destructive",
      });
      return;
    }

    // API Call
    setLoading(true);
    try {
      const response = await AuthService.register({ name, email, password });
      
      // Handle Success
      toast({
        title: "Success!",
        description: response.message || "Registration successful! Redirecting...",
      });
      
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);

    } catch (err: any) {
      // Logic: If your interceptor handles the toast, you do nothing here.
      // If you want a specific "Registration Failed" message:
      console.error("Registration failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-bg flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-background rounded-3xl shadow-xl border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center text-coral font-bold text-2xl mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Begin Your Wellness Journey
          </h2>
          <p className="text-muted-foreground mt-2">
            Create your account to access compassionate mental health support
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-center rounded-lg py-2 mb-4">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent text-foreground bg-background"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent text-foreground bg-background"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              Create Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent text-foreground bg-background"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-foreground text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent text-foreground bg-background"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
            />
          </div>

          <Button variant="coral" size="lg" className="w-full py-3">
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-coral font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;