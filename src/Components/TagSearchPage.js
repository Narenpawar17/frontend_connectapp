import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications

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
    setUsers([]); // Clear previous users

    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`https://backendconnectapp.onrender.com/api/users/searchtag/${encodeURIComponent(searchTag.trim())}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.length === 0) {
        toast.info('No users found with this tag'); // Show toast notification
      }

      // Use the profile images directly from the response or set a default image
      const usersWithImages = response.data.map(user => ({
        ...user,
        profileImage: user.profileImage || '/path/to/default/image.jpg'
      }));

      setUsers(usersWithImages);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('No user found');
      toast.error('No user found'); // Show toast notification for errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 -mt-10 -ml-10 -mr-10 text-white bg-black">
      <div className="max-w-lg p-4 mx-auto bg-gray-800 rounded-lg shadow-lg w-96">
        <h1 className="mb-4 text-2xl font-bold">Search Users by Tag</h1>
        <input
          type="text"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          className="w-full p-2 mb-4 text-black rounded"
          placeholder="Enter tag"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
        
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        
        <div className="mt-6">
          {users.length > 0 ? (
            <ul>
              {users.map(user => (
                <li key={user._id} className="flex items-center p-4 mb-4 bg-gray-800 rounded-lg shadow-md">
                  <img 
                    src={user.profileImage} 
                    alt={user.username} 
                    className="object-cover w-16 h-16 mr-4 rounded-full" 
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
      <ToastContainer /> {/* Add ToastContainer to your component */}
    </div>
  );
};

export default TagSearchPage;
