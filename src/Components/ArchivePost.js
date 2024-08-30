import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ArchivePost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`https://backendconnectapp.onrender.com/api/posts/archived/owner/${user?.email}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setPosts(response.data);
      } catch (error) {
        setError('Error fetching posts');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchPosts();
    }
  }, [user?.email]);

  const handleRemove = async (postId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found');
      return;
    }

    try {
      await axios.patch(`https://backendconnectapp.onrender.com/api/posts/archive/${postId}`, { archived: false }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Update the UI by removing the post from the list
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error removing post:', error.response?.data?.message || error.message);
      setError('Error removing post');
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen p-4 -mt-10 -ml-10 -mr-10 text-white bg-zinc-900">
      <h1 className="mb-10 ml-5 text-2xl font-bold">Archived Posts</h1>
      <div className="flex flex-col space-y-4">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} className="w-full max-w-md mx-auto mb-8 overflow-hidden bg-black border border-gray-800 rounded-lg shadow-lg">
              <div className="flex">
                <div className="relative flex-shrink-0 w-44" style={{ paddingBottom: '56.25%' }}>
                  <img
                    src={post.imgUrl}
                    alt={post.name}
                    className="absolute inset-0 object-cover w-full h-full"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="flex-grow p-4">
                  <h2 className="mb-2 text-2xl font-semibold text-white">
                    {post.name}
                  </h2>
                  <p className="mb-2 text-sm text-gray-300">
                    <span className="font-medium">Email:</span> <br /> {post.email}
                  </p>
                  <p className="mb-2 text-sm text-gray-300">
                    <span className="font-medium">Address:</span> <br /> {post.address}
                  </p>
                  <p className="mb-2 text-sm text-gray-300">
                    <span className="font-medium">Phone:</span> <br /> {post.phone}
                  </p>
                </div>
              </div>
              <div className="flex justify-between p-4 bg-gray-900 border-t border-gray-800">
                <button
                  onClick={() => handleRemove(post._id)}
                  className="px-4 py-2 text-gray-300 bg-red-600 rounded hover:text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No archived posts found</p>
        )}
      </div>
    </div>
  );
};

export default ArchivePost;
