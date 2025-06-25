
import React, { useState, useCallback } from 'react';
import { BlogPost, Comment as CommentType } from '../types';
import EmojiReactions from './EmojiReactions';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface BlogPostItemProps {
  post: BlogPost;
  onAddComment: (postId: string, commentText: string, author: string) => void;
  onAddReaction: (postId: string, emoji: string) => void;
}

const BlogPostItem: React.FC<BlogPostItemProps> = ({ post, onAddComment, onAddReaction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleAddComment = useCallback((text: string, author: string) => {
    onAddComment(post.id, text, author);
  }, [onAddComment, post.id]);

  const handleAddReaction = useCallback((emoji: string) => {
    onAddReaction(post.id, emoji);
  }, [onAddReaction, post.id]);

  return (
    <article className="bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl mb-8">
      {post.featuredImage && (
        <img src={post.featuredImage} alt={post.title} className="w-full h-56 object-cover" />
      )}
      <div className="p-6">
        <h2 className="text-3xl font-bold text-purple-700 mb-2 truncate" title={post.title}>{post.title}</h2>
        <div className="text-sm text-slate-500 mb-3">
          <span>By {post.author}</span> | <span>{post.date}</span>
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">{post.excerpt}</p>

        {!isExpanded && (
          <button
            onClick={handleToggleExpand}
            className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center"
            aria-expanded={isExpanded}
            aria-controls={`post-content-${post.id}`}
          >
            Read More
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        )}

        {isExpanded && (
          <div id={`post-content-${post.id}`} className="mt-4 animate-fadeIn">
            <div
              className="prose prose-slate max-w-none prose-h3:text-purple-700 prose-a:text-purple-600 hover:prose-a:text-purple-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <EmojiReactions reactions={post.reactions} onAddReaction={handleAddReaction} postId={post.id} />

            <div className="mt-8 border-t border-slate-200 pt-6">
              <CommentList comments={post.comments} />
              <CommentForm onSubmitComment={handleAddComment} />
            </div>

            <button
              onClick={handleToggleExpand}
              className="mt-6 text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center"
              aria-expanded={isExpanded}
              aria-controls={`post-content-${post.id}`}
            >
              Show Less
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>
       {/* Basic CSS for fadeIn animation - Tailwind doesn't have this out of the box without custom config */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </article>
  );
};

export default BlogPostItem;
