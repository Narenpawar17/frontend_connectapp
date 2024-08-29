import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './Components/Sidebar';
import Hero from './Components/Hero';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CreatePost from './Components/CreatePost';
import UpdatePost from './Components/UpdatePost';
import ArchivePost from './Components/ArchivePost';
import RightSidebar from './Components/RightSidebar';
import PrivateRoute from './Components/PrivateRoute';
import PostUpdated from './pages/PostUpdated';
import MyPosts from './Components/MyPosts';
import DeletePost from './Components/DeletePost';
import Settings from './Components/Settings';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import './index.css';
import ProfilePage from './Components/ProfilePage';
import AllUsersPage from './Components/AllUsersPage'; // Import AllUsers component
import TagSearchPage from './Components/TagSearchPage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/create-post" element={<PrivateRoute element={<CreatePost />} />} />
            <Route path="/update-post/:postId" element={<PostUpdated />} />
            <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />

            <Route path="/profile/:username" element={<PrivateRoute element={
                <div className="flex">
                  <Sidebar />
                  <div className="flex-grow mt-10 ml-72"> 
                    <ProfilePage />
                  </div>
                  <div className="w-64 ml-4 bg-gray-100 border-l"> 
                    <RightSidebar />
                  </div>
                </div>
              } />} />

            <Route path="/archive-post" element={<PrivateRoute element={
                <div className="flex">
                  <Sidebar />
                  <div className="flex-grow mt-10 ml-72"> 
                    <ArchivePost />
                  </div>
                  <div className="w-64 ml-4 bg-gray-100 border-l"> 
                    <RightSidebar />
                  </div>
                </div>
              } />} />

            <Route path="/update-post" element={<PrivateRoute element={
                <div className="flex">
                  <Sidebar />
                  <div className="flex-grow mt-10 ml-72"> 
                    <UpdatePost />
                  </div>
                  <div className="w-64 ml-4 bg-gray-100 border-l"> 
                    <RightSidebar />
                  </div>
                </div>
              } />} />

            <Route path="/delete-post" element={<PrivateRoute element={
                <div className="flex">
                  <Sidebar />
                  <div className="flex-grow mt-10 ml-72"> 
                    <DeletePost />
                  </div>
                  <div className="w-64 ml-4 bg-gray-100 border-l"> 
                    <RightSidebar />
                  </div>
                </div>
              } />} />

            <Route path="/myposts" element={<PrivateRoute element={
                <div className="flex">
                  <Sidebar />
                  <div className="flex-grow mt-10 ml-72"> 
                    <MyPosts />
                  </div>
                  <div className="w-64 ml-4 bg-gray-100 border-l"> 
                    <RightSidebar />
                  </div>
                </div>
              } />} />

            <Route path="/all-users" element={<PrivateRoute element={
                <div className="flex">
                  <Sidebar />
                  <div className="flex-grow mt-10 ml-72"> 
                    <AllUsersPage />
                  </div>
                  <div className="w-64 ml-4 bg-gray-100 border-l"> 
                    <RightSidebar />
                  </div>
                </div>
              } />} />

            <Route path="/tag-search" element={<PrivateRoute element={
                <div className="flex">
                  <Sidebar />
                  <div className="flex-grow mt-10 ml-72"> 
                    <TagSearchPage />
                  </div>
                  <div className="w-64 ml-4 bg-gray-100 border-l"> 
                    <RightSidebar />
                  </div>
                </div>
              } />} />

            <Route path="/" element={
              <PrivateRoute element={
                <div className="flex">
                  <Sidebar />
                  <div className="flex-grow mt-10 ml-72"> 
                    <Hero />
                  </div>
                  <div className="w-64 ml-4 bg-gray-100 border-l"> 
                    <RightSidebar />
                  </div>
                </div>
              } />} 
            />
            
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
