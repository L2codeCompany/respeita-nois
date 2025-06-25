
import React, { useState, useCallback, useEffect } from 'react';
import { BlogPost, Comment, Reaction } from './types';
// initialBlogPosts is currently empty, so fetch/localStorage is primary
import { initialBlogPosts as fallbackPosts } from './data/blogPosts'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BlogPostItem from './components/BlogPostItem';
import { GOOGLE_DOC_PUBLISHED_URL } from './constants';

const LOCAL_STORAGE_KEY = 'respeitaNoisBlogPosts';
const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

interface StoredBlogData {
  posts: BlogPost[];
  timestamp: number;
}

// Helper to generate a simple excerpt
const createExcerpt = (htmlContent: string, length = 150): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const text = tempDiv.textContent || tempDiv.innerText || "";
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Function to fetch and parse Google Doc content
const fetchGoogleDocPosts = async (): Promise<BlogPost[]> => {
  if (GOOGLE_DOC_PUBLISHED_URL === 'YOUR_PUBLISHED_GOOGLE_DOC_URL_HERE' || !GOOGLE_DOC_PUBLISHED_URL) {
    console.warn('Google Doc URL is a placeholder or not set. Please update constants.ts. Displaying fallback content.');
    // To prevent error when GOOGLE_DOC_PUBLISHED_URL is an empty string or placeholder
    return fallbackPosts.length > 0 ? fallbackPosts : []; 
  }

  try {
    const response = await fetch(GOOGLE_DOC_PUBLISHED_URL);
    console.log(`Fetching Google Doc from: ${GOOGLE_DOC_PUBLISHED_URL}`);
    console.log(`Response status: ${response.status}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Doc: ${response.statusText}`);
    }
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const fetchedPosts: BlogPost[] = [];
    // Google Docs often wraps content in a div with class 'c1', 'c2' etc. or just body.
    // Headings like H1 are often used for sections/post titles.
    const headings = doc.querySelectorAll('h1'); 

    headings.forEach((heading, index) => {
      const title = heading.textContent || `Post ${index + 1}`;
      let contentHtml = '';
      let currentNode = heading.nextElementSibling;
      
      // Collect all sibling elements until the next H1 or end of document
      while (currentNode && currentNode.tagName !== 'H1') {
        contentHtml += currentNode.outerHTML;
        currentNode = currentNode.nextElementSibling;
      }

      if (title.trim() && contentHtml.trim()) {
        fetchedPosts.push({
          id: `gdoc-post-${title.toLowerCase().replace(/\s+/g, '-')}-${index}`,
          title: title.trim(),
          author: 'Respeita Nóis',
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          excerpt: createExcerpt(contentHtml),
          content: contentHtml,
          comments: [],
          reactions: [],
        });
      }
    });

    if (fetchedPosts.length === 0 && doc.body.innerHTML.trim().length > 0 && headings.length === 0) {
        // Fallback: If no H1s found, treat the whole body content as a single post
        console.warn("No H1 headings found in Google Doc. Attempting to parse entire body as a single post.");
        const fullBodyContent = doc.body.innerHTML;
        const pageTitle = doc.title || "Untitled Document";
         fetchedPosts.push({
          id: `gdoc-post-single-${pageTitle.toLowerCase().replace(/\s+/g, '-')}`,
          title: pageTitle,
          author: 'Respeita Nóis',
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          excerpt: createExcerpt(fullBodyContent),
          content: fullBodyContent,
          comments: [],
          reactions: [],
        });
    }
    
    return fetchedPosts;
  } catch (error) {
    console.error('Error fetching or parsing Google Doc:', error);
    throw error; // Re-throw to be caught by the caller
  }
};


const App: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedItem = localStorage.getItem(LOCAL_STORAGE_KEY);
        let postsToUse: BlogPost[] | null = null;
        let updateLocalStorage = false;
        let fetchedNewData = false;

        if (storedItem) {
          const parsedStorage: StoredBlogData = JSON.parse(storedItem);
          console.log(Date.now() - parsedStorage.timestamp < TWENTY_FOUR_HOURS_IN_MS);
          if (parsedStorage && Array.isArray(parsedStorage.posts) && typeof parsedStorage.timestamp === 'number') {
            if (Date.now() - parsedStorage.timestamp < TWENTY_FOUR_HOURS_IN_MS && parsedStorage.posts.length > 0) {
              postsToUse = parsedStorage.posts; 
            } else {
              console.log("Local storage data is stale. Attempting to fetch fresh data.");
              try {
                postsToUse = await fetchGoogleDocPosts();
                if (postsToUse.length > 0) {
                   updateLocalStorage = true;
                   fetchedNewData = true;
                } else {
                    console.warn("Fetched no posts from Google Doc, using stale local data if available or fallbackPosts.");
                    postsToUse = parsedStorage.posts.length > 0 ? parsedStorage.posts : fallbackPosts;
                }
              } catch (fetchError) {
                console.error("Failed to fetch fresh data, using stale local data if available or fallbackPosts:", fetchError);
                postsToUse = parsedStorage.posts.length > 0 ? parsedStorage.posts : fallbackPosts;
              }
            }
          }
        }
        
        if (!postsToUse) { 
          console.log("No valid local storage or data was stale and new fetch was needed. Attempting to fetch fresh data.");
          try {
            postsToUse = await fetchGoogleDocPosts();
             if (postsToUse.length > 0) {
                updateLocalStorage = true;
                fetchedNewData = true;
             } else {
                console.warn("Fetched no posts from Google Doc, using fallbackPosts.");
                postsToUse = fallbackPosts;
             }
          } catch (fetchError) {
            console.error("Failed to fetch fresh data, using fallbackPosts:", fetchError);
            setError('Could not load posts. Please check the Google Doc URL or try again later.');
            postsToUse = fallbackPosts; 
          }
        }
        
        setBlogPosts(postsToUse || []);
        if (updateLocalStorage && postsToUse && postsToUse.length > 0) {
           localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ posts: postsToUse, timestamp: Date.now() }));
        }

      } catch (e) {
        console.error("Error in post loading logic:", e);
        setError('An unexpected error occurred while loading posts.');
        setBlogPosts(fallbackPosts); 
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []); 

  useEffect(() => {
    if (!isLoading && blogPosts.length > 0) { 
      try {
        const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
        let existingTimestamp = Date.now(); // Default to now if no prior timestamp
        if (storedDataString) {
            const storedData: StoredBlogData = JSON.parse(storedDataString);
            if (storedData.timestamp) {
                existingTimestamp = storedData.timestamp;
            }
        }
        
        const dataToStore: StoredBlogData = {
          posts: blogPosts,
          timestamp: existingTimestamp, // Preserve the timestamp from initial load/fetch
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
      } catch (e) {
        console.error("Error saving posts to local storage due to interactions:", e);
      }
    }
  }, [blogPosts, isLoading]); // Removed 'error' dependency to allow saving even if there was an initial load error but posts were later populated (e.g. from fallback)

  const handleAddComment = useCallback((postId: string, commentText: string, author: string) => {
    setBlogPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: `c${post.id}-${Date.now()}`,
            author,
            text: commentText,
            timestamp: new Date().toISOString(),
          };
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );
  }, []);

  const handleAddReaction = useCallback((postId: string, emoji: string) => {
    setBlogPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const existingReactionIndex = post.reactions.findIndex(r => r.emoji === emoji);
          let updatedReactions: Reaction[];

          if (existingReactionIndex > -1) {
            updatedReactions = post.reactions.map((r, index) =>
              index === existingReactionIndex ? { ...r, count: r.count + 1 } : r
            );
          } else {
            updatedReactions = [...post.reactions, { emoji, count: 1 }];
          }
          return { ...post, reactions: updatedReactions };
        }
        return post;
      })
    );
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center bg-slate-100">
        <div className="text-purple-600 text-2xl font-semibold">Loading posts...</div>
        {/* Spinner idea: <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mt-4"></div> */}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight">
            Comitê <span className="text-purple-600">Respeita Nóis</span>
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Nosso comitê foi criado em 2023, com o objetivo de acolher e ouvir colegas que possam ter passado por situações de desrespeito ou desconforto no ambiente de trabalho, como em questões de gênero, cor, sexualidade, crença ou sotaque.
          </p>
        </header>
        
        {error && (
          <div className="text-center text-red-600 bg-red-100 p-4 rounded-md max-w-3xl mx-auto mb-6 shadow">
            <p className="font-bold">Error Loading Content:</p>
            <p>{error}</p>
          </div>
        )}

        {blogPosts.length > 0 ? (
          <div className="max-w-3xl mx-auto">
            {blogPosts.map(post => (
              <BlogPostItem
                key={post.id}
                post={post}
                onAddComment={handleAddComment}
                onAddReaction={handleAddReaction}
              />
            ))}
          </div>
        ) : (
          !error && <p className="text-center text-slate-500 text-xl mt-10">No blog posts available at the moment. If you've configured a Google Doc URL, please ensure it's correct, published, and contains H1 headings for posts.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
