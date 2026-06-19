import { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("player");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; form?: string }>({});
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    let newErrors: { name?: string; email?: string; password?: string; form?: string } = {};

    // Validate name
    if (!name || name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Validate password (Secure Password Check)
    if (!password) {
      newErrors.password = "Password is required.";
    } else {
      if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters.";
      } else {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
          newErrors.password = "Password must contain uppercase, lowercase, numbers, and symbols.";
        }
      }
      
      if (email && password.toLowerCase().includes(email.toLowerCase().split('@')[0])) {
        newErrors.password = "Password cannot contain parts of your email address.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(name, email, password, role);
      navigate("/arena");
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || t('auth.failed');
      setErrors({ form: errMsg });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4 backdrop-blur-xl bg-gray-800/40 rounded-2xl shadow-2xl border border-gray-600/30 transition-all duration-500 hover:shadow-emerald-500/20 hover:border-emerald-500/30">
        {/* Modern 3D Glossy 8-Ball */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#4b5563_0%,_#0b0f19_60%,_#000000_100%)] border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.8),inset_0_4px_12px_rgba(255,255,255,0.25)] flex items-center justify-center animate-float overflow-hidden select-none z-20">
          {/* Glass glare highlight */}
          <div className="absolute top-1.5 left-3.5 w-10 h-5 bg-gradient-to-b from-white/35 via-white/5 to-transparent rounded-full rotate-[-15deg] blur-[0.5px]"></div>
          
          {/* Bottom bounce light reflection */}
          <div className="absolute bottom-1 right-3 w-8 h-3 bg-white/10 rounded-full blur-[1px] opacity-60"></div>
          
          {/* White target circle */}
          <div className="w-9 h-9 bg-gradient-to-tr from-gray-200 via-white to-gray-100 rounded-full flex items-center justify-center shadow-[inset_0_-2px_6px_rgba(0,0,0,0.25),0_4px_8px_rgba(0,0,0,0.5)] transform rotate-[10deg]">
            <span
              className="text-gray-950 font-black text-xl tracking-tighter"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              8
            </span>
          </div>
        </div>

        <h2 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg uppercase tracking-tight">
          All 8 Pool
          <span className="block text-2xl font-semibold text-gray-300 mt-1">
            {t('auth.join')}
          </span>
        </h2>

        {errors.form && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-bold mb-6 text-center animate-in fade-in">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left" noValidate>
          <div>
            <label className="block text-gray-200 font-black text-[10px] uppercase tracking-widest mb-2 ml-1">
              {t('auth.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={`w-full px-4 py-3 bg-gray-900/60 border ${errors.name ? 'border-red-500' : 'border-gray-600/50'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 font-bold`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 font-bold text-xs mt-2 ml-1 animate-in slide-in-from-top-1 duration-200">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-200 font-black text-[10px] uppercase tracking-widest mb-2 ml-1">
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className={`w-full px-4 py-3 bg-gray-900/60 border ${errors.email ? 'border-red-500' : 'border-gray-600/50'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 font-bold`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 font-bold text-xs mt-2 ml-1 animate-in slide-in-from-top-1 duration-200">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-200 font-black text-[10px] uppercase tracking-widest mb-2 ml-1">
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              className={`w-full px-4 py-3 bg-gray-900/60 border ${errors.password ? 'border-red-500' : 'border-gray-600/50'} rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 font-bold`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 font-bold text-xs mt-2 ml-1 leading-normal animate-in slide-in-from-top-1 duration-200">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 mt-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black uppercase tracking-tighter rounded-xl shadow-lg hover:shadow-emerald-500/30 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none"
          >
            {t('auth.register_btn')}
          </button>
        </form>

        <p className="text-center text-gray-400 text-[10px] font-black uppercase tracking-widest mt-8">
          🎱 {t('auth.have_account')}{" "}
          <Link
            to="/login"
            className="text-emerald-400 hover:text-emerald-300 transition underline decoration-2 underline-offset-4"
          >
            {t('nav.login')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
