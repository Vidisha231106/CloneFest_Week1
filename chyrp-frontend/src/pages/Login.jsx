// src/pages/Login.jsx

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../api'; // Import our central API client
import './Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // The /token endpoint expects form data, not JSON.
    // We use URLSearchParams to format it correctly.
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      // Send the login request to the backend
      const response = await apiClient.post('/token', formData);
      
      // If successful, store the token in localStorage
      localStorage.setItem('token', response.data.access_token);
      
      // Navigate to the page the user was trying to access, or the home page
      navigate(from, { replace: true });

    } catch (err) {
      setError('Login failed. Please check your username and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dot-pattern bg-[size:20px_20px] bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900" />
      
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-700/10 rounded-2xl blur-2xl" />
        
        <div className="relative bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 space-y-8 shadow-2xl">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="rounded bg-slate-800 border-purple-500/20 text-purple-500 focus:ring-purple-500/20"
                />
                <span className="text-sm text-gray-300">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In...
                </div>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-400 hover:text-purple-300 transition-colors duration-200">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;