import React from "react";
import Logo from "../../assets/FutureLinkLogo.svg";

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="hidden md:block">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <img src={Logo} alt="FutureLink" className="h-10 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Create your account</h2>
            <p className="text-gray-600">
              Join FutureLink to manage applicants, streamline screening, and accelerate hiring.
            </p>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="md:hidden flex items-center justify-center mb-6">
              <img src={Logo} alt="FutureLink" className="h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
            <p className="text-gray-600 mb-6">No credit card required</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input type="text" className="input" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input type="text" className="input" placeholder="Doe" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input type="text" className="input" placeholder="Acme Inc." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Work email</label>
                <input type="email" className="input" placeholder="you@company.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" className="input" placeholder="Create a strong password" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                <input type="password" className="input" placeholder="Re-enter password" />
              </div>
            </div>

            <div className="flex items-start gap-2 mt-4">
              <input id="terms" type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-custom-teal focus:ring-custom-teal" />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the <span className="text-custom-teal">Terms</span> and <span className="text-custom-teal">Privacy Policy</span>.
              </label>
            </div>

            <button className="w-full bg-custom-teal text-white py-2.5 rounded-lg font-medium mt-4 hover:opacity-90 transition">
              Create account
            </button>

            <p className="text-sm text-gray-600 mt-6 text-center">
              Already have an account? <span className="text-custom-teal font-medium cursor-pointer">Sign in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


