import React from 'react';
import { FaHome, FaInstagram, FaPlus, FaEdit, FaList, FaUser, FaCog, FaArchive, FaTrash, FaUsers, FaSearch } from 'react-icons/fa'; // Updated imports
import { useAuth } from '../contexts/AuthContext'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNavigation = (path) => (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    navigate(path); // Navigate to the specified path
  };

  // Fallback for username
  const userName = user?.username || 'Username';

  return (
    <div className="fixed top-0 left-0 flex flex-col justify-between w-64 h-screen text-white bg-black shadow-md">
      <div className="p-6">
        <h2 className="flex items-center mb-8 text-2xl font-bold text-white">
          <FaInstagram className="mr-2 text-4xl" />
          Connect
        </h2>
        <ul className="space-y-5">
          <li>
            <a href="/" onClick={handleNavigation('/')} className="flex items-center px-5 py-1 rounded-lg hover:bg-gray-700">
              <FaHome className="mr-3 text-xl" style={{ fontSize: '1rem' }} />
              Home
            </a>
          </li>
          <li>
            <a href={`/profile/${userName}`} onClick={handleNavigation(`/profile/${userName}`)} className="flex items-center px-5 py-1 rounded-lg hover:bg-gray-700">
              <FaUser className="mr-3 text-xl" style={{ fontSize: '1rem' }} />
              Profile Page
            </a>
          </li>
          
          <li>
            <a href="/search-tag" onClick={handleNavigation('/tag-search')} className="flex items-center px-5 py-1 rounded-lg hover:bg-gray-700">
              <FaSearch className="mr-3 text-xl" style={{ fontSize: '1rem' }} />
              Search by Tag
            </a>
          </li>

          <li>
            <a href="/all-users" onClick={handleNavigation('/all-users')} className="flex items-center px-5 py-1 rounded-lg hover:bg-gray-700">
              <FaUsers className="mr-3 text-xl" style={{ fontSize: '1rem' }} />
              All Users
            </a>
          </li>
          <li>
            <a href="/myposts" onClick={handleNavigation('/myposts')} className="flex items-center px-5 py-1 rounded-lg hover:bg-gray-700">
              <FaList className="mr-3 text-xl" style={{ fontSize: '1rem' }} />
              My Posts
            </a>
          </li>
          <li>
            <a href="/create-post" onClick={handleNavigation('/create-post')} className="flex items-center px-5 py-1 rounded-lg hover:bg-gray-700">
              <FaPlus className="mr-3 text-xl" style={{ fontSize: '1rem' }} />
              Create Post
            </a>
          </li>
          <li>
            <a href="/update-post" onClick={handleNavigation('/update-post')} className="flex items-center px-5 py-1 rounded-lg hover:bg-gray-700">
              <FaEdit className="mr-3 text-xl" style={{ fontSize: '1rem' }} />
              Update Post
            </a>
          </li>
          <li>
            <a href="/delete-post" onClick={handleNavigation('/delete-post')} className="flex items-center px-5 py-1 rounded-lg hover:bg-gray-700">
              <FaTrash className="mr-3 text-xl" style={{ fontSize: '1rem' }} />
              Delete Post
            </a>
          </li>
          <li>
            <a href="/archive-post" onClick={handleNavigation('/archive-post')} className="flex items-center px-5 py-1 rounded-lg hover:bg-gray-700">
              <FaArchive className="mr-3 text-xl" style={{ fontSize: '1rem' }} />
              Archive Post
            </a>
          </li>
          <li>
            <a href="/settings" onClick={handleNavigation('/settings')} className="flex items-center px-5 py-1 rounded-lg hover:bg-gray-700">
              <FaCog className="mr-3 text-xl" style={{ fontSize: '1rem' }} />
              Settings
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
