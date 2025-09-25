import React from "react";
import Logo from "../../assets/FutureLinkLogo.svg";

type LoginProps = {
  onSignIn?: () => void;
};

const Login: React.FC<LoginProps> = ({ onSignIn }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="hidden md:block">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <img src={Logo} alt="FutureLink" className="h-10 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome back</h2>
            <p className="text-gray-600 leading-relaxed">
              Sign in to access your HR suite. Track screening, assessments, selection,
              and engagement in one place.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-600">Screening</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-600">Assessment</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-600">Selection</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="md:hidden flex items-center justify-center mb-6">
              <img src={Logo} alt="FutureLink" className="h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
            <p className="text-gray-600 mb-6">Enter your credentials to continue</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="input" placeholder="you@company.com" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <button className="text-sm text-custom-teal hover:underline">Forgot?</button>
                </div>
                <input type="password" className="input" placeholder="••••••••" />
              </div>

              <div className="flex items-center gap-2">
                <input id="remember" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" />
                <label htmlFor="remember" className="text-sm text-gray-700">Remember me</label>
              </div>

              <button
                className="w-full bg-custom-teal text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition"
                onClick={onSignIn}
              >
                Sign in
              </button>

              {/* Removed social login section as requested */}
            </div>

            <p className="text-sm text-gray-600 mt-6 text-center">
              Don’t have an account? <span className="text-custom-teal font-medium cursor-pointer">Create one</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


