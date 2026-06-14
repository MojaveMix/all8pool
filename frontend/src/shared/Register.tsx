import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('player');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="w-full max-w-md p-8 bg-secondary rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-accent text-center mb-8">All 8 Pool Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-primary border border-gray-700 rounded focus:border-accent outline-none text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-primary border border-gray-700 rounded focus:border-accent outline-none text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-primary border border-gray-700 rounded focus:border-accent outline-none text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 bg-primary border border-gray-700 rounded focus:border-accent outline-none text-white"
            >
              <option value="player">Player</option>
              <option value="owner">Pool Hall Owner</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-accent text-primary font-bold rounded hover:bg-opacity-90 transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
