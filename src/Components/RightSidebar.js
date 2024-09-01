import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Slider from 'react-slick';  // Import the Slider component from react-slick

const RightSidebar = () => {
  const { user, logout } = useAuth();

  // Generate URLs for random images using picsum.photos
  const picsumImages = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    src: `https://picsum.photos/200/300?random=${index + 1}`
  }));

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500  // Change slide every 1.5 seconds
  };

  const handleLogout = () => {
    logout(); // Perform logout
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <div className="fixed top-0 right-0 flex flex-col justify-between w-64 h-screen text-white bg-black shadow-md">
      <div className="p-6 border-b border-gray-800 -py-10">
        <h2 className="mb-6 text-2xl font-bold">Sponsored</h2>
        <div className="overflow-hidden h-60">
          <Slider {...settings}>
            {picsumImages.map(img => (
              <div key={img.id} className="overflow-hidden bg-gray-800 rounded-lg shadow-md">
                <img src={img.src} alt={`Sponsored Ad ${img.id}`} className="object-cover w-full h-full" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">About the Sponsor</h3>
          <p className="mt-2 text-sm">
            We are proud to showcase our sponsors who help make this platform possible. 
            Stay tuned for exciting offers and updates from them!
          </p>
        </div>
      </div>
      <div className="p-6 mb-12 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png" alt="Profile" className="w-12 h-12 border-2 border-gray-700 rounded-full" />
          <div>
            <p className="ml-3 font-semibold">{user?.firstName || 'Username'}</p>
          </div>
        </div>
        <button
          className="w-full px-4 py-2 mt-2 text-sm text-white bg-blue-600 rounded-full hover:bg-blue-700"
          onClick={handleLogout}
        >
          Logout
        </button>
        
      </div>
    </div>
  );
};

export default RightSidebar;
