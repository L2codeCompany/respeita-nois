
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="text-3xl font-bold tracking-tight">
          StoryStream
        </a>
        <div className="space-x-4">
          <a href="#" className="hover:text-amber-300 transition-colors">Home</a>
          <a href="#" className="hover:text-amber-300 transition-colors">About</a>
          <a href="#" className="hover:text-amber-300 transition-colors">Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
