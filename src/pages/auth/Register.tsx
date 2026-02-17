import React, { useState } from "react";
import Logo from "../../assets/logo-default.png";
import { IconLock, IconUser, IconMail, IconBuilding, IconCheck, IconEye, IconEyeOff } from "@tabler/icons-react";

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-light/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      {/* Animated Mesh Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

      <div className="max-w-4xl w-full relative z-10 transition-all duration-500">
        <div className="glass-card rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fadeIn">
          {/* Left Side - Info Panel */}
          <div className="hidden md:flex md:w-5/12 bg-white/5 p-12 flex-col justify-between border-r border-white/10">
            <div>
              <img src={Logo} alt="FutureLink" className="h-16 mb-12 drop-shadow-2xl" />
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Empowering <br />
                <span className="text-primary-light">The Future</span> <br />
                Of Talent.
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                Join our premium ecosystem designed for high-performance HR management and recruitment orchestration.
              </p>
            </div>

            <div className="space-y-6">
              {[
                "Advanced Candidate Tracking",
                "Automated Assessment Flows",
                "Real-time Collaboration Tools"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white/80">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <IconCheck size={14} className="text-primary-light" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 p-8 md:p-12">
            <div className="md:hidden flex flex-col items-center mb-8">
              <img src={Logo} alt="FutureLink" className="h-12 mb-4" />
              <h1 className="text-2xl font-bold text-white">Create Account</h1>
            </div>

            <div className="mb-10 hidden md:block">
              <h1 className="text-3xl font-bold text-white">Get Started</h1>
              <p className="text-text-secondary mt-2">Initialize your administrative workspace.</p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">First Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                      <IconUser size={18} />
                    </div>
                    <input type="text" className="glass-input w-full pl-11 py-3 rounded-2xl" placeholder="Jane" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Last Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                      <IconUser size={18} />
                    </div>
                    <input type="text" className="glass-input w-full pl-11 py-3 rounded-2xl" placeholder="Doe" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Work Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                    <IconMail size={18} />
                  </div>
                  <input type="email" className="glass-input w-full pl-11 py-3 rounded-2xl" placeholder="jane@futurelink.io" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Organization</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                    <IconBuilding size={18} />
                  </div>
                  <input type="text" className="glass-input w-full pl-11 py-3 rounded-2xl" placeholder="Global Operations" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider ml-1">Secure Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                    <IconLock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="glass-input w-full pl-11 pr-12 py-3 rounded-2xl"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 px-1">
                <input id="terms" type="checkbox" className="mt-1 h-5 w-5 rounded-lg border-white/10 bg-white/5 text-primary focus:ring-primary/30 transition-all checked:bg-primary" />
                <label htmlFor="terms" className="text-sm text-text-secondary">
                  I certify that I have read and agree to the <span className="text-primary-light hover:underline cursor-pointer">Service Agreement</span> and <span className="text-primary-light hover:underline cursor-pointer">Privacy Framework</span>.
                </label>
              </div>

              <button className="btn-premium w-full mt-4">
                Establish Workspace
              </button>

              <p className="text-sm text-center text-text-secondary mt-8">
                Already part of FutureLink? <span className="text-primary-light font-bold hover:text-white transition-colors cursor-pointer">Sign in</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;



