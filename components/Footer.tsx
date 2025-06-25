
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-8 mt-12">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; ${new Date().getFullYear()} StoryStream. All rights reserved.</p>
        <p className="text-sm mt-1">Crafted with <span className="text-amber-400">❤️</span> and React</p>
      </div>
    </footer>
  );
};

export default Footer;
