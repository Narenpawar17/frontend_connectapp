import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TagSearchPage = () => {
  const [searchTag, setSearchTag] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTag.trim()) {
      setError('Please enter a tag');
      return;
    }

    setLoading(true);
    setError('');
    setUsers([]);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        `https://backendconnectapp.onrender.com/api/users/searchtag/${encodeURIComponent(searchTag.trim())}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.length === 0) {
        toast.info('No users found with this tag');
      }

      const usersWithImages = response.data.map((user) => ({
        ...user,
        profileImage: user.profileImage || '/path/to/default/image.jpg',
      }));

      setUsers(usersWithImages);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('No user found');
      toast.error('No user found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 text-white bg-black -mt-10 -ml-10 -mr-10">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-center text-blue-400">Search Users by Tag</h1>
        <div className="relative">
          <input
            type="text"
            value={searchTag}
            onChange={(e) => setSearchTag(e.target.value)}
            className="w-full p-3 mb-4 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter tag"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-2 px-4 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        <div className="mt-6">
          {users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={user._id} className="flex items-center p-4 mb-4 bg-gray-800 rounded-lg shadow-md">
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="object-cover w-16 h-16 mr-4 rounded-full border-2 border-blue-400"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{user.username}</h2>
                    <p className="text-gray-300">{user.bio || 'No bio available'}</p>
                    <div className="mt-2">
                      {user.tags && (
                        <span className="px-2 py-1 text-sm font-medium text-white bg-blue-500 rounded-full">
                          #{user.tags}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            !loading && <p className="text-gray-400">No users found</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TagSearchPage;
