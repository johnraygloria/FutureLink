import React, { useState } from "react";
import Logo from "../../assets/logo-default.png";

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

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Call the onSignIn callback if provided
      if (onSignIn) {
        onSignIn(data);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center ">
            <img src={Logo} alt="FutureLink" className="h-24" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Sign in</h1>
          {/* <p className="text-gray-600 mb-6 text-center">Enter your HR department and password to continue</p> */}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HR Department
              </label>
              <select
                value={hrDepartment}
                onChange={(e) => setHrDepartment(e.target.value)}
                className="input"
                required
              >
                <option value="">Select HR Department</option>
                {HR_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <button 
                  type="button"
                  className="text-sm text-custom-teal hover:underline"
                  onClick={() => {
                    if (hrDepartment) {
                      setPassword(
                        hrDepartment === 'Admin' 
                          ? 'MaribelAbataFutureLinkAdmin'
                          : `${hrDepartment}FutureLink`
                      );
                    }
                  }}
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {hrDepartment && (
                <p className="text-xs text-gray-500 mt-1">
                  {hrDepartment === 'Admin' 
                    ? 'Admin password: MaribelAbataFutureLinkAdmin'
                    : `Password format: ${hrDepartment}FutureLink`}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal"
              />
              <label htmlFor="remember" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-custom-teal text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;


