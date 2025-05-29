import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

const Register = () => {
  const [values, setValues] = useState({ username:'', email:'', password:'' });
  const [error, setError]   = useState(null);
  const navigate = useNavigate();

  const handleChanges = e => setValues(v => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/api/auth/register', values);
      if (res.status === 201) navigate('/login');
      else setError('Registro fallido');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="shadow-lg px-8 py-5 border w-72">
        <h2 className="text-lg font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username</label>
            <input
              id="username" name="username" type="text"
              className="w-full px-3 py-2 border"
              value={values.username}
              onChange={handleChanges}
              required
            />
          </div>
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
          <button type="submit" className="w-full bgcolor-green-600 text-white py-2">Submit</button>
        </form>
        <div className="text-center mt-4">
          <span>Already have account? </span>
          <Link to="/login" className="text-blue-500">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;