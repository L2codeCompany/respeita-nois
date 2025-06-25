
import React, { useState } from 'react';

interface CommentFormProps {
  onSubmitComment: (text: string, author: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmitComment }) => {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !authorName.trim()) {
      setError('Both name and comment text are required.');
      return;
    }
    setError('');
    onSubmitComment(commentText, authorName);
    setCommentText('');
    // Optionally clear authorName too, or keep it for multiple comments
    // setAuthorName(''); 
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h4 className="text-lg font-semibold text-slate-700 mb-2">Leave a Comment</h4>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="mb-4">
        <label htmlFor="authorName" className="block text-sm font-medium text-slate-600 mb-1">Your Name</label>
        <input
          type="text"
          id="authorName"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="commentText" className="block text-sm font-medium text-slate-600 mb-1">Your Comment</label>
        <textarea
          id="commentText"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={4}
          placeholder="Write your comment here..."
          className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          required
        />
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      >
        Post Comment
      </button>
    </form>
  );
};

export default CommentForm;
