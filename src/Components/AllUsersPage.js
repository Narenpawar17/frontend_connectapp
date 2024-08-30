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

      // Filter out the current user from the list of users
      const filteredUsers = usersData.filter((user) => user.username !== currentUserData.username);

      // Fetch profile images from localStorage and update users with profile images
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

      // Initialize button states
      if (currentUserData && currentUserData.following) {
        const initialButtonState = {};
        usersWithImages.forEach((user) => {
          initialButtonState[user._id] = currentUserData.following.includes(user._id)
            ? { followDisabled: true, unfollowDisabled: false }
            : { followDisabled: false, unfollowDisabled: true };
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
    setButtonState((prevState) => ({
      ...prevState,
      [userId]: { followDisabled: true, unfollowDisabled: false },
    }));

    try {
      const { data } = await axios.post(
        'https://backendconnectapp.onrender.com/api/users/follow',
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      toast.success('Followed successfully!');
      setButtonState((prevState) => ({
        ...prevState,
        [userId]: { followDisabled: true, unfollowDisabled: false },
      }));

      updateFollowersCount(userId, data.updatedFollowersCount);
      updateCurrentUserFollowing(userId, true);
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user.');
      setButtonState((prevState) => ({
        ...prevState,
        [userId]: { ...prevState[userId], followDisabled: false },
      }));
    }
  };

  const handleUnfollow = async (userId) => {
    setButtonState((prevState) => ({
      ...prevState,
      [userId]: { followDisabled: false, unfollowDisabled: true },
    }));

    try {
      const { data } = await axios.post(
        'https://backendconnectapp.onrender.com/api/users/unfollow',
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      toast.success('Unfollowed successfully!');
      setButtonState((prevState) => ({
        ...prevState,
        [userId]: { followDisabled: false, unfollowDisabled: true },
      }));

      updateFollowersCount(userId, data.updatedFollowersCount);
      updateCurrentUserFollowing(userId, false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user.');
      setButtonState((prevState) => ({
        ...prevState,
        [userId]: { ...prevState[userId], unfollowDisabled: false },
      }));
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
      <h1 className="mb-10 text-2xl font-bold">All Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col space-y-6">
          {users.map((user) => (
            <div key={user._id} className="max-w-2xl p-6 mx-auto bg-black border border-gray-800 rounded-lg shadow-lg">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 overflow-hidden rounded-full">
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold">{user.username}</h2>
                </div>
                <div className="flex space-x-4">
                  <button
                    className={`px-6 py-2 rounded-full transition-colors duration-300 ${
                      buttonState[user._id]?.followDisabled
                        ? 'bg-blue-300 text-blue-100 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    onClick={() => handleFollow(user._id)}
                    disabled={buttonState[user._id]?.followDisabled}
                  >
                    Follow
                  </button>
                  <button
                    className={`px-6 py-2 rounded-full transition-colors duration-300 ${
                      buttonState[user._id]?.unfollowDisabled
                        ? 'bg-red-300 text-red-100 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    onClick={() => handleUnfollow(user._id)}
                    disabled={buttonState[user._id]?.unfollowDisabled}
                  >
                    Unfollow
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AllUsersPage;
