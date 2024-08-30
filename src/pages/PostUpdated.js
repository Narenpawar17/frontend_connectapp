import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PostUpdated = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage

      try {
        const response = await axios.get(`https://backendconnectapp.onrender.com/api/posts/${postId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in Authorization header
          },
        });
        const post = response.data;
        setName(post.name);
        setAddress(post.address);
        setPhone(post.phone);
        setImgUrl(post.imgUrl);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    try {
      await axios.put(`https://backendconnectapp.onrender.com/api/posts/${postId}`, { name, address, phone, imgUrl }, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
        },
      });

      navigate('/update-post');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

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
        <h1 className="mb-6 text-3xl font-bold">Update Post</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
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
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
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
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
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
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostUpdated;
