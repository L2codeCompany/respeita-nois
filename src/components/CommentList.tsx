
import React from 'react';
import { Comment } from '../../types';

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return <p className="text-slate-500 italic mt-4">No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      <h4 className="text-lg font-semibold text-slate-700">Comments ({comments.length})</h4>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-slate-100 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold text-purple-700">{comment.author}</p>
            <p className="text-xs text-slate-500">{new Date(comment.timestamp).toLocaleString()}</p>
          </div>
          <p className="text-slate-700 whitespace-pre-wrap">{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
