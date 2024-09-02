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

      const response = await axios.get(
        `https://backendconnectapp.onrender.com/api/users/${user.username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      const response = await axios.post(
        'https://backendconnectapp.onrender.com/api/users/uploadProfilePicture',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.profileImage) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: response.data.profileImage,
        }));

        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        toast.success('Profile picture updated successfully!');
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
      await axios.put(
        `https://backendconnectapp.onrender.com/api/users/${user.username}/update-biotag`,
        {
          bio: newBio,
          tags: newTags
            .split(',')
            .map((tag) => tag.trim())
            .join(', '),
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
        tags: newTags
          .split(',')
          .map((tag) => tag.trim())
          .join(', '),
      }));

      setEditSuccess(true);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile');
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-lg text-gray-300">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white -mt-10 -ml-10 -mr-10">
      <div className="container px-6 py-8 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Profile</h1>
        </div>

        {/* Profile Card */}
        {profile ? (
          <div className="max-w-4xl p-8 mx-auto bg-gray-800 rounded-lg shadow-lg">
            <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-8">
              {/* Profile Image and Upload Button */}
              <div className="relative">
                <img
                  src={
                    profile.profileImage ||
                    'https://via.placeholder.com/150x150.png?text=Profile+Image'
                  }
                  alt={`${profile.username}'s profile`}
                  className="object-cover w-40 h-40 rounded-full shadow-md"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 mt-6 md:mt-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">{profile.username}</h2>
                  <button
                    onClick={handleUpload}
                    className="px-4 py-2 text-sm font-medium text-white transition duration-300 bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Upload Picture
                  </button>
                </div>

                {editMode ? (
                  <div className="mt-6">
                    <label className="block mb-2 text-sm font-medium text-gray-200">
                      Bio
                    </label>
                    <textarea
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                      className="w-full p-3 mb-4 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      placeholder="Tell us about yourself"
                    />

                    <label className="block mb-2 text-sm font-medium text-gray-200">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      className="w-full p-3 mb-4 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., developer, musician, traveler"
                    />

                    <div className="flex space-x-4">
                      <button
                        onClick={handleEditSubmit}
                        className="px-4 py-2 text-sm font-medium text-white transition duration-300 bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 text-sm font-medium text-white transition duration-300 bg-red-600 rounded-md hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    <p className="mb-4 text-gray-300">
                      {profile.bio ||
                        'Adventurer and foodie with a passion for fitness. Exploring the world one city at a time, sharing experiences through travel, culinary delights, and workouts.'}
                    </p>

                    <div className="flex mb-4 space-x-8">
                      <div className="text-center">
                        <p className="text-xl font-bold">
                          {profile.postsCount || 0}
                        </p>
                        <p className="text-gray-400">Posts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold">
                          {profile.followersCount || 0}
                        </p>
                        <p className="text-gray-400">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold">
                          {profile.followingCount || 0}
                        </p>
                        <p className="text-gray-400">Following</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap mb-4">
                      {profile.tags
                        ? profile.tags.split(',').map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 m-1 text-sm text-gray-100 bg-blue-600 rounded-full"
                            >
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
                      className="px-4 py-2 text-sm font-medium text-white transition duration-300 bg-yellow-500 rounded-md hover:bg-yellow-600"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400">Profile not found</p>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ProfilePage;
