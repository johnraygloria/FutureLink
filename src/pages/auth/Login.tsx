import React, { useState } from "react";
import Logo from "../../assets/logo-default.png";
import { IconLock, IconChevronDown, IconBriefcase, IconEye, IconEyeOff } from "@tabler/icons-react";

type LoginProps = {
  onSignIn?: (userData?: { token: string; user: any }) => void;
};

const HR_DEPARTMENTS = [
  "Admin",
  "Screening",
  "Assessment",
  "Selection",
  "Engagement",
  "Employee Relations"
];

const Login: React.FC<LoginProps> = ({ onSignIn }) => {
  const [hrDepartment, setHrDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hrDepartment || !password) {
      setError("Please select HR Department and enter password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hr_department: hrDepartment.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      if (onSignIn) {
        onSignIn(data);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center px-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-light/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      {/* Animated Mesh Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

      <div className="max-w-md w-full relative z-10 transition-all duration-500 hover:scale-[1.01]">
        <div className="glass-card rounded-[2.5rem] p-10 animate-fadeIn">
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110"></div>
              <img src={Logo} alt="FutureLink" className="h-28 relative z-10 drop-shadow-2xl animate-pulse-once" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight text-center">
              Welcome Back
            </h1>
            <p className="text-text-secondary mt-2 text-center text-sm">
              Please enter your credentials to access your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary ml-1">
                HR Department
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                  <IconBriefcase size={20} stroke={2} />
                </div>
                <select
                  value={hrDepartment}
                  onChange={(e) => setHrDepartment(e.target.value)}
                  className="glass-input w-full pl-12 pr-10 py-3.5 rounded-2xl appearance-none cursor-pointer"
                  required
                >
                  <option value="" className="bg-slate-900">Select HR Department</option>
                  {HR_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900 border-none">
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-white/40">
                  <IconChevronDown size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-text-secondary">Password</label>
                <button
                  type="button"
                  className="text-xs text-primary-light hover:text-white transition-colors font-medium"
                  onClick={() => setPassword('1')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                  <IconLock size={20} stroke={2} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="glass-input w-full pl-12 pr-12 py-3.5 rounded-2xl"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                </button>
              </div>
              {hrDepartment && (
                <div className="flex items-center gap-1.5 px-1 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                  <p className="text-[11px] text-text-secondary">
                    Quick Access: Password is <span className="text-primary-light font-bold">1</span>
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger-light px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-shake">
                <div className="w-1 h-1 rounded-full bg-danger animate-ping"></div>
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 px-1">
              <div className="relative flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="peer h-5 w-5 rounded-lg border-white/10 bg-white/5 text-primary focus:ring-primary/30 transition-all checked:bg-primary"
                />
              </div>
              <label htmlFor="remember" className="text-sm text-text-secondary cursor-pointer hover:text-white transition-colors">
                Regular workspace device
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-premium w-full flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Securing entry...</span>
                </>
              ) : (
                <>
                  <span>Sign into Portal</span>
                  <div className="transition-transform group-hover:translate-x-1">
                    →
                  </div>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-text-secondary/60">
              © 2026 FutureLink Innovations. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;



