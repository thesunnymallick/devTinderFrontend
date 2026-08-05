import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  LockIcon,
  ViewIcon,
  EyeOffIcon,
} from "@hugeicons/core-free-icons";
import logo from "../../assets/logo.png";
import { Link } from "react-router";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface SignupErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: SignupErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof SignupErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccessMessage("✓ Account created! Redirecting...");
      setTimeout(() => {
        console.log("Redirecting to dashboard");
      }, 2000);
    } catch (error) {
      setErrors({ email: "Signup failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0D0D0F]">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
         w-[850px] h-[850px] rounded-full
bg-violet-500/20 blur-[180px]"
      />

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
       w-[500px] h-[500px] rounded-full bg-violet-400/20 blur-[120px]"
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center ">
        <div
          className="px-[16px] sm:px-8 lg:px-12 py-12 bg-[#141418]/60
           sm:border border-[#2A2A35]
          backdrop-blur-3xl  rounded-2xl h-screen sm:h-full"
        >
          {/* Logo & Header */}
          <div className="mb-4">
            <div className="flex items-center flex-col mb-4">
              <img src={logo} className="w-[80px] h-[80px] object-contain" />
              <h1 className="text-3xl font-bold text-white">
                <span className="text-indigo-400">Dev</span>Tinder
              </h1>
            </div>

            <div className="flex flex-col items-center justify-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3">
                Create account
              </h2>
              <p className="text-slate-400 text-base sm:text-lg">
                Join and start connecting with amazing developers
              </p>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="max-w-md space-y-6">
            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
                <p className="text-green-400 text-sm font-medium">
                  {successMessage}
                </p>
              </div>
            )}

            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Full name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-xl
  bg-[#18181B]
  border
  text-white
  placeholder:text-[#71717A]
  transition-all duration-300
  focus:outline-none
  focus:ring-2
  focus:ring-[#8B5CF6]/30
  ${
    errors.name ? "border-red-500" : "border-[#2A2A35] focus:border-[#8B5CF6]"
  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl
  bg-[#18181B]
  border
  text-white
  placeholder:text-[#71717A]
  transition-all duration-300
  focus:outline-none
  focus:ring-2
  focus:ring-[#8B5CF6]/30
  ${
    errors.email ? "border-red-500" : "border-[#2A2A35] focus:border-[#8B5CF6]"
  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={LockIcon}
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl
  bg-[#18181B]
  border
  text-white
  placeholder:text-[#71717A]
  transition-all duration-300
  focus:outline-none
  focus:ring-2
  focus:ring-[#8B5CF6]/30
  ${
    errors.password
      ? "border-red-500"
      : "border-[#2A2A35] focus:border-[#8B5CF6]"
  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <HugeiconsIcon icon={EyeOffIcon} size={20} />
                  ) : (
                    <HugeiconsIcon icon={ViewIcon} size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Confirm password
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={LockIcon}
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl
  bg-[#18181B]
  border
  text-white
  placeholder:text-[#71717A]
  transition-all duration-300
  focus:outline-none
  focus:ring-2
  focus:ring-[#8B5CF6]/30
  ${
    errors.confirmPassword
      ? "border-red-500"
      : "border-[#2A2A35] focus:border-[#8B5CF6]"
  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <HugeiconsIcon icon={EyeOffIcon} size={20} />
                  ) : (
                    <HugeiconsIcon icon={ViewIcon} size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Agree to Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 bg-slate-800 border border-slate-700 rounded accent-indigo-400 cursor-pointer"
                />
                 <span className="text-sm text-slate-400">
                    I agree to the{" "}
                    <a href="#" className="text-violet-400 hover:text-violet-300 underline"> Terms & Conditions</a> {" "}
                    and {" "}
                    <a href="#"  className="text-violet-400 hover:text-violet-300 underline">Privacy Policy</a>

                     </span>
           
              </label>
              {errors.agreeToTerms && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.agreeToTerms}
                </p>
              )}
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full  bg-gradient-to-r from-[#7C5CFF] via-[#8B5CF6] to-[#A78BFA]
               text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:scale-100   disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-slate-400 text-sm mt-8 max-w-md">
            Already have an account?{" "}
            
            <Link to={"/login"} className="text-violet-400
            hover:text-violet-300 font-semibold transition-colors">
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;