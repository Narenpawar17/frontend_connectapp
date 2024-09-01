import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonState, setButtonState] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem('user'));
      const username = storedUser?.username;

      if (!username) {
        throw new Error('Username not found in session storage');
      }

      const { data } = await axios.get(`https://backendconnectapp.onrender.com/api/users/${username}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setCurrentUser(data);
      fetchUsers(data);
    } catch (error) {
      console.error('Error fetching current user:', error);
      toast.error('Failed to load current user.');
    }
  };

  const fetchUsers = async (currentUserData) => {
    setLoading(true);
    try {
      const { data: usersData } = await axios.get('https://backendconnectapp.onrender.com/api/all-users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const filteredUsers = usersData.filter((user) => user.username !== currentUserData.username);

      const usersWithImages = filteredUsers.map((user) => {
        const localStorageKey = `profileImage_${user.username}`;
        const localProfileImage = localStorage.getItem(localStorageKey);
        console.log('all users local profile image : ', localStorageKey, localProfileImage);

        return {
          ...user,
          profileImage: localProfileImage || user.profileImage || '/path/to/default/image.jpg',
        };
      });

      setUsers(usersWithImages);

      if (currentUserData && currentUserData.following) {
        const initialButtonState = {};
        usersWithImages.forEach((user) => {
          initialButtonState[user._id] = currentUserData.following.includes(user._id)
            ? { isFollowing: true }
            : { isFollowing: false };
        });
        setButtonState(initialButtonState);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const { data } = await axios.post(
        'https://backendconnectapp.onrender.com/api/users/follow',
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      toast.success('Followed successfully!');
      setButtonState((prevState) => ({
        ...prevState,
        [userId]: { isFollowing: true },
      }));

      updateFollowersCount(userId, data.updatedFollowersCount);
      updateCurrentUserFollowing(userId, true);
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user.');
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const { data } = await axios.post(
        'https://backendconnectapp.onrender.com/api/users/unfollow',
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      toast.success('Unfollowed successfully!');
      setButtonState((prevState) => ({
        ...prevState,
        [userId]: { isFollowing: false },
      }));

      updateFollowersCount(userId, data.updatedFollowersCount);
      updateCurrentUserFollowing(userId, false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user.');
    }
  };

  const updateFollowersCount = (userId, updatedCount) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, followersCount: updatedCount } : user
      )
    );
  };

  const updateCurrentUserFollowing = (userId, isFollowing) => {
    setCurrentUser((prevUser) => {
      if (isFollowing) {
        return {
          ...prevUser,
          following: [...prevUser.following, userId],
        };
      } else {
        return {
          ...prevUser,
          following: prevUser.following.filter((id) => id !== userId),
        };
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen p-4 -mt-10 -ml-10 -mr-10 text-white bg-zinc-900">
      <h1 className="mb-10 text-2xl font-bold text-center">All Users</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div key={user._id} className="flex flex-col items-center p-6 space-y-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
              <div className="w-24 h-24 overflow-hidden rounded-full">
                <img
                  src={user.profileImage}
                  alt={user.username}
                  className="object-cover w-full h-full"
                />
              </div>
              <h2 className="text-xl font-semibold text-center">{user.username}</h2>
              {buttonState[user._id]?.isFollowing ? (
                <button
                  className="px-6 py-2 text-white transition-colors duration-300 bg-red-500 rounded-full hover:bg-red-600"
                  onClick={() => handleUnfollow(user._id)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="px-6 py-2 text-white transition-colors duration-300 bg-blue-500 rounded-full hover:bg-blue-600"
                  onClick={() => handleFollow(user._id)}
                >
                  Follow
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AllUsersPage;
