// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

const Login = () => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChanges = e => setValues(v => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/api/auth/login', values);
      const { token, role } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="shadow-lg px-8 py-5 border w-72">
        <h2 className="text-lg font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              id="email" name="email" type="email"
              className="w-full px-3 py-2 border"
              value={values.email}
              onChange={handleChanges}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              id="password" name="password" type="password"
              className="w-full px-3 py-2 border"
              value={values.password}
              onChange={handleChanges}
              required
            />
          </div>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button type="submit" className="w-full bg-green-600 text-white py-2">Submit</button>
        </form>
        <div className="text-center mt-4">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-blue-500">Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
