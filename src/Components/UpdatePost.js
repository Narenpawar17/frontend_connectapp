import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UpdatePost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage

      try {
        const response = await axios.get(`https://connectbackend17-0ohzrims.b4a.run/api/posts/owner/${user?.email}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in Authorization header
          },
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchPosts();
    }
  }, [user?.email]);

  if (loading) return <p>Loading...</p>;

  const handleUpdate = (postId) => {
    navigate(`/update-post/${postId}`);
    console.log(`Update post with ID: ${postId}`);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 -mt-10 -ml-10 -mr-10 text-white bg-zinc-900">
      <h1 className="mt-0 mb-10 ml-5 text-2xl font-bold">Update Post Page</h1>
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
                <button className="text-gray-300 hover:text-white">Like</button>
                <button className="text-gray-300 hover:text-white">Comment</button>
                <button className="text-gray-300 hover:text-white">Share</button>
                <button
                  onClick={() => handleUpdate(post._id)}
                  className="px-1 py-1 text-gray-300 bg-red-600 rounded-lg hover:text-white"
                >
                  Update
                </button>
              </div>

            </div>
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </div>
  );
};

export default UpdatePost;
