import React, { useState } from "react";
import { useNavigate } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  LockIcon,
  ViewIcon,
  EyeOffIcon,
} from "@hugeicons/core-free-icons";
import logo from "../../assets/logo.png";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser, clearAuthError } from "../../store/authSlice";
import { validateEmail, validateLoginPassword } from "../../utils/validation";

interface LoginFormData {
  emailId: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFieldErrors {
  emailId?: string;
  password?: string;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error: apiError } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<LoginFormData>({
    emailId: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});

  const validateForm = (): boolean => {
    const newErrors: LoginFieldErrors = {};

    const emailResult = validateEmail(formData.emailId);
    if (!emailResult.valid) newErrors.emailId = emailResult.message;

    const passwordResult = validateLoginPassword(formData.password);
    if (!passwordResult.valid) newErrors.password = passwordResult.message;

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (fieldErrors[name as keyof LoginFieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (apiError) dispatch(clearAuthError());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await dispatch(
      loginUser({ emailId: formData.emailId.trim(), password: formData.password })
    );

    if (loginUser.fulfilled.match(result)) {
      navigate("/", { replace: true });
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div
          className="w-full max-w-md px-6 sm:px-8 py-8 bg-[#141418]/60
           border border-[#2A2A35]
          backdrop-blur-3xl rounded-2xl"
        >
          {/* Logo & Header */}
          <div className="mb-6">
            <div className="flex items-center flex-col mb-3">
              <img src={logo} className="w-[48px] h-[48px] object-contain" />
              <h1 className="text-xl font-bold text-white">
                <span className="text-indigo-400">Dev</span>Tinder
              </h1>
            </div>

            <div className="flex flex-col items-center justify-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">
                Welcome back
              </h2>
              <p className="text-slate-400 text-sm text-center">
                Sign in to connect with amazing developers
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* API error */}
            {apiError && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm font-medium">{apiError}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="emailId"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />

                <input
                  type="email"
                  id="emailId"
                  name="emailId"
                  autoComplete="email"
                  value={formData.emailId}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full pl-11 pr-4 py-2.5 text-sm rounded-xl
  bg-[#18181B]
  border
  text-white
  placeholder:text-[#71717A]
  transition-all duration-300
  focus:outline-none
  focus:ring-2
  focus:ring-[#8B5CF6]/30
  ${
    fieldErrors.emailId
      ? "border-red-500"
      : "border-[#2A2A35] focus:border-[#8B5CF6]"
  }`}
                />
              </div>
              {fieldErrors.emailId && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.emailId}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <HugeiconsIcon
                  icon={LockIcon}
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-11 py-2.5 text-sm rounded-xl
  bg-[#18181B]
  border
  text-white
  placeholder:text-[#71717A]
  transition-all duration-300
  focus:outline-none
  focus:ring-2
  focus:ring-[#8B5CF6]/30
  ${
    fieldErrors.password
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
                    <HugeiconsIcon icon={EyeOffIcon} size={18} />
                  ) : (
                    <HugeiconsIcon icon={ViewIcon} size={18} />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 bg-slate-800 border border-slate-700 rounded accent-indigo-400 cursor-pointer"
                />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7C5CFF] via-[#8B5CF6] to-[#A78BFA]
               text-white font-semibold py-2.5 text-sm rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-violet-400
            hover:text-violet-300 font-semibold transition-colors"
            >
              Create account
            </a>
          </p>

          {/* Terms */}
          <p className="text-xs text-slate-500 text-center mt-4">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="text-slate-400 hover:text-slate-300 underline"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-slate-400 hover:text-slate-300 underline"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;