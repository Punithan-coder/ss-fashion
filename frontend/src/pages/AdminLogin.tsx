import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('ssfashion-admin-token')) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('ssfashion-admin-token', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid login credentials.');
      }
    } catch (err) {
      setError('Login failed. Please try again later.');
    }
  };

  return (
    <div className="page min-h-screen bg-lavender-100 py-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-[32px] shadow-2xl p-10 md:p-14">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-rose-500 mb-4">Admin Access</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">
              SS Fashion Dashboard
            </h1>
            <p className="text-stone-600 mt-4">
              Secure admin login to manage products, stock, pricing, and store inventory.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Admin Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-rose-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-rose-200"
                required
              />
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button type="submit" className="btn-luxury w-full">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
