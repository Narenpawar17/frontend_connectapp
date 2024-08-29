import React from "react";

const MiddleColumn = ({ post }) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8 overflow-hidden bg-black border border-gray-800 rounded-lg shadow-lg">
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
      </div>
    </div>
  );
};

export default MiddleColumn;
