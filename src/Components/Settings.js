import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put('https://connectbackend17-0ohzrims.b4a.run/api/user/change-email', { newEmail: email }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      // Update user info in context if needed
      if (response.data.user) {
        setUser(response.data.user);
      }

      toast.success('Email updated successfully');
    } catch (error) {
      console.error('Error changing email:', error.response?.data?.message || error.message);
      toast.error('Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('https://connectbackend17-0ohzrims.b4a.run/api/user/change-password', { currentPassword: password, newPassword: newPassword }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error changing password:', error.response?.data?.message || error.message);
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-white bg-gray-900">
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Home
        </button>
      </div>
      <div className="flex flex-col items-center flex-grow p-4">
        <h1 className="mb-6 text-3xl font-bold">Settings</h1>
        <div className="w-full max-w-md">
          <form onSubmit={handleEmailChange} className="p-6 mb-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">Change Email</h2>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium">New Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="New Email"
                required
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Change Email
            </button>
          </form>

          <form onSubmit={handlePasswordChange} className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-semibold">Change Password</h2>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm font-medium">Current Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Current Password"
                required
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block mb-2 text-sm font-medium">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
