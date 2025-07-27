"use client";
import Link from "next/link";
import React, { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/context/AuthContext";

import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  AlertCircle, 
  GraduationCap,
  LogIn,
  ArrowRight,
  Shield,
  Users
} from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  // Redirect authenticated users away from signin page
  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  // Check for any messages from URL params
  React.useEffect(() => {
    const message = searchParams.get('message');
    const error = searchParams.get('error');
    
    if (message) {
      toast({
        title: "Information",
        description: message,
      });
    }
    
    if (error) {
      if (error === 'CredentialsSignin') {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("An error occurred during sign in. Please try again.");
      }
    }
  }, [searchParams, toast]);
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else {
          setError("An error occurred during sign in. Please try again.");
        }
      } else if (result?.ok) {
        // Wait for session to be established
        await getSession();
        
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        
        // Redirect to home or intended page
        const callbackUrl = searchParams.get('callbackUrl') || '/';
        router.push(callbackUrl);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('google', {
        callbackUrl: searchParams.get('callbackUrl') || '/',
        redirect: false
      });
      
      if (result?.error) {
        setError("Google sign-in failed. Please try again.");
      } else if (result?.url) {
        // Redirect to the callback URL
        router.push(result.url);
      }
    } catch (error) {
      setError("Google sign-in failed. Please try again.");
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    router.push('/admin/login');
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset functionality will be available soon. Please contact support if needed.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-green-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mr-4">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">EduConnect Africa</h2>
            </div>
            
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Welcome Back to Your Journey
            </h1>
            
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              Continue exploring universities and opportunities across Africa with your personalized dashboard.
            </p>

            {/* Quick Stats or Benefits */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <GraduationCap className="h-4 w-4 text-green-200" />
                </div>
                <span className="text-green-100">Access your saved universities</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <LogIn className="h-4 w-4 text-green-200" />
                </div>
                <span className="text-green-100">Continue your applications</span>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full p-2 mr-3">
                  <ArrowRight className="h-4 w-4 text-green-200" />
                </div>
                <span className="text-green-100">Get personalized recommendations</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 border border-white/20 rounded-full" />
        <div className="absolute bottom-10 right-20 w-32 h-32 border border-white/10 rounded-full" />
        <div className="absolute top-1/2 right-5 w-2 h-2 bg-white/40 rounded-full" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6 lg:hidden">
              <div className="bg-green-600 text-white rounded-2xl p-3 mr-3">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">EduConnect Africa</h2>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h1>
            <p className="text-gray-600 mb-6">
              Sign in to continue your educational journey
            </p>
          </div>

          {/* Login Type Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800">Student Login</h3>
                  <p className="text-xs text-green-600 mt-1">Access your dashboard</p>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer" onClick={handleAdminLogin}>
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-800">Admin Login</h3>
                  <p className="text-xs text-blue-600 mt-1">Manage platform</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Student Sign In</CardTitle>
              <CardDescription className="text-center">
                Choose your sign-in method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Admin Login Button */}
              <Button
                onClick={handleAdminLogin}
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Shield className="mr-2 h-4 w-4" />
                Sign in as Administrator
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue as student</span>
                </div>
              </div>

              {/* Google Sign In */}
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              {/* Email Sign In Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-green-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In as Student
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-green-600 hover:underline font-medium"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-green-600"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}