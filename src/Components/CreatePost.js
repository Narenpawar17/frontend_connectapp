import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import your AuthContext

const CreatePost = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [error, setError] = useState(null); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the authenticated user from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors

    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }

    try {
      await axios.post('https://backendconnectapp.onrender.com/api/posts/create', {
        name,
        address,
        phone,
        imgUrl,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
        },
      });

      navigate('/myposts');
    } catch (error) {
      setError(error.response?.data?.message || error.message); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-white bg-gray-900">
      <div className="flex items-center justify-between p-4 bg-gray-800 shadow-lg">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Home
        </button>
        <h1 className="text-2xl font-semibold">Create a New Post</h1>
        <div />
      </div>
      <div className="flex flex-col items-center flex-grow p-6 bg-gray-900">
        <form onSubmit={handleSubmit} className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-center">New Post</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter the name of the post"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block mb-2 text-sm font-medium">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter the address"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block mb-2 text-sm font-medium">Phone</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter the phone number"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="imgUrl" className="block mb-2 text-sm font-medium">Image URL</label>
            <input
              type="text"
              id="imgUrl"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              required
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter the image URL"
            />
          </div>
          {loading && <p className="mb-4 text-blue-500">Creating post...</p>}
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
