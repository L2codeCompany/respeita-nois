
export interface Reaction {
  emoji: string;
  count: number;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string; // ISO string for simplicity
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string; // e.g., "October 26, 2023"
  excerpt: string;
  content: string; // Full content, can be multi-paragraph HTML or plain text
  featuredImage?: string; // Optional image URL
  comments: Comment[];
  reactions: Reaction[]; 
}
