import React, { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("player");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate("/");
    } catch (error) {
      console.error(error);
      // alert("Registration failed");
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
        {/* 8-Ball Decorative Element */}
        {/* Custom Pool Ball (Solid 8-Ball with float animation) */}
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl flex items-center justify-center border-2 border-gray-600 animate-float">
          <div className="absolute top-1.5 left-2 w-6 h-6 bg-white/40 rounded-full blur-[1px]"></div>
          <div className="absolute bottom-2 right-3 w-3 h-3 bg-white/20 rounded-full blur-[0.5px]"></div>
          <span
            className="text-white font-black text-2xl drop-shadow-lg relative z-10"
            style={{ textShadow: "0 2px 3px rgba(0,0,0,0.5)" }}
          >
            8
          </span>
          <div className="absolute inset-0 rounded-full border border-white/10"></div>
        </div>

        <h2 className="text-4xl font-black text-center mb-8 bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
          All 8 Pool
          <span className="block text-2xl font-semibold text-gray-300 mt-1">
            Join the Game
          </span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-200 font-medium mb-2 tracking-wide">
              Player Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 font-medium mb-2 tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-200 font-medium mb-2 tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900/60 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
              placeholder="Create a strong password"
              required
            />
          </div>

          {/* Role selection is kept commented as in original */}
          {/* <div>
            <label className="block text-gray-200 font-medium mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/60 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
            >
              <option value="player">Player</option>
              <option value="owner">Pool Hall Owner</option>
            </select>
          </div> */}

          <button
            type="submit"
            className="w-full py-3.5 mt-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/30 transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Register & Play
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          🎱 Rack 'em up! Ready to break?{" "}
          <Link
            to="/login"
            className="underline text-emerald-400 hover:text-emerald-300 transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
