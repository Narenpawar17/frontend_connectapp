import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [newTags, setNewTags] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    if (!user) {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`https://backendconnectapp.onrender.com/api/users/${user.username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('response of the user in profile page : ', response);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, editSuccess]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://backendconnectapp.onrender.com/api/users/uploadProfilePicture', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.profileImage) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: response.data.profileImage, // Cloudinary URL
        }));

        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error('Profile image path missing in response');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError('Error uploading profile picture');
    }
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `https://backendconnectapp.onrender.com/api/users/${user.username}/update-biotag`,
        {
          bio: newBio,
          tags: newTags.split(',').map((tag) => tag.trim()).join(', '),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditMode(false);

      setProfile((prevProfile) => ({
        ...prevProfile,
        bio: newBio,
        tags: newTags.split(',').map((tag) => tag.trim()).join(', '),
      }));

      setEditSuccess(true);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile');
    }
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;

  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen p-6 -mt-10 -ml-10 -mr-10 text-white bg-black">
      <div className="bg-gray-800 shadow-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Home
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center p-4">
        {profile ? (
          <div className="flex flex-col items-center w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="relative">
              <img
                src={profile.profileImage}
                alt={`${profile.username}'s profile`}
                className="w-32 h-32 border-4 border-gray-700 rounded-full"
              />
              <div
                className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" />
                </svg>
              </div>
            </div>

            <div className="mt-4 text-center">
              <h1 className="mb-2 text-3xl font-bold">{profile.username}</h1>

              {editMode ? (
                <div className="w-full mt-4">
                  <textarea
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    className="w-full p-2 mb-4 text-black rounded"
                    placeholder="Update your bio"
                  />
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full p-2 mb-4 text-black rounded"
                    placeholder="Update your tag"
                  />
                  <button
                    onClick={handleEditSubmit}
                    className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 ml-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p className="mb-4 text-lg text-gray-300">
                    {profile.bio ||
                      `Adventurer and foodie with a passion for fitness. Exploring the world one city at a time, sharing experiences through travel, culinary delights, and workouts.`}
                  </p>
                  <div className="flex justify-center mb-4 space-x-6">
                    <span className="font-semibold text-gray-300">
                      Posts: <strong>{profile.postsCount || 0}</strong>
                    </span>
                    <span className="font-semibold text-gray-300">
                      Followers: <strong>{profile.followersCount || 0}</strong>
                    </span>
                    <span className="font-semibold text-gray-300">
                      Following: <strong>{profile.followingCount || 0}</strong>
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center mb-4">
                    {profile.tags
                      ? profile.tags.split(',').map((tag) => (
                          <span key={tag} className="px-3 py-1 mb-2 mr-2 text-sm font-medium text-white bg-blue-500 rounded-full">
                            #{tag.trim()}
                          </span>
                        ))
                      : null}
                  </div>
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setNewBio(profile.bio || '');
                      setNewTags(profile.tags || '');
                    }}
                    className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Profile not found</p>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleUpload}
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Upload Profile Picture
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
