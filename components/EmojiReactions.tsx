
import React from 'react';
import { Reaction } from '../types';
import { EMOJI_OPTIONS } from '../constants';

interface EmojiReactionsProps {
  reactions: Reaction[];
  onAddReaction: (emoji: string) => void;
  postId: string; 
}

const EmojiReactions: React.FC<EmojiReactionsProps> = ({ reactions, onAddReaction, postId }) => {
  const getReactionCount = (emoji: string): number => {
    const reaction = reactions.find(r => r.emoji === emoji);
    return reaction ? reaction.count : 0;
  };

  return (
    <div className="mt-4 flex items-center space-x-2 flex-wrap">
      <span className="text-sm font-medium text-slate-600 mr-2">React:</span>
      {EMOJI_OPTIONS.map((emoji) => (
        <button
          key={`${postId}-reaction-${emoji}`}
          onClick={() => onAddReaction(emoji)}
          className="p-1.5 rounded-full hover:bg-slate-200 transition-colors text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label={`React with ${emoji}`}
        >
          <span role="img" aria-label={emoji}>{emoji}</span>
          <span className="ml-1 text-xs text-slate-500">{getReactionCount(emoji) > 0 ? getReactionCount(emoji) : ''}</span>
        </button>
      ))}
    </div>
  );
};

export default EmojiReactions;
