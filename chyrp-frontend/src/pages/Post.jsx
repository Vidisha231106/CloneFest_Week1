// src/pages/Post.jsx

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import apiClient from '../api';
import Comments from '../components/Comments';
import EnhancedContent from '../components/EnhancedContent';
import Lightbox from '../components/Lightbox';
import EmbedPreview from '../components/EmbedPreview';
import './Post.css';

const Post = () => {
  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostAndUser = async () => {
      try {
        // --- Step 1: Fetch the post data ---
        const postResponse = await apiClient.get(`/posts/${postId}`);
        setPost(postResponse.data);

        // --- Step 2 (NEW): Record the view ---
        // This is a "fire-and-forget" call; we don't need the response.
        // A separate try/catch ensures that if this fails, the post still loads.
        try {
          apiClient.post(`/views/posts/${postId}`);
        } catch (viewError) {
          console.error("Failed to record view:", viewError);
        }

        // --- Step 3: Fetch the current user ---
        const userResponse = await apiClient.get('/users/me');
        setCurrentUser(userResponse.data);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Error fetching data:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPostAndUser();
  }, [postId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await apiClient.delete(`/posts/${postId}`);
        navigate('/'); // Redirect to home page after deletion
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert('Failed to delete post. You may not have permission.');
      }
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      alert("You must be logged in to like a post.");
      return;
    }
    try {
      const response = await apiClient.post(`/posts/${postId}/like`);
      setPost(response.data);
    } catch (error) {
      alert("Failed to update like status. You may not have permission.");
      console.error(error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
      <p className="text-gray-400 text-lg">Loading...</p>
    </div>
  );
  
  if (!post) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
      <h1 className="text-2xl text-gray-300">Post not found</h1>
    </div>
  );

  const canEdit = currentUser && (
    currentUser.group.permissions.includes('edit_post') ||
    (currentUser.id === post.owner.id && currentUser.group.permissions.includes('edit_own_post'))
  );

  const canDelete = currentUser && (
    currentUser.group.permissions.includes('delete_post') ||
    (currentUser.id === post.owner.id && currentUser.group.permissions.includes('delete_own_post'))
  );

  const isLikedByCurrentUser = post.liked_by_users.some(
    (user) => user.id === currentUser?.id
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black w-full">
      {/* Full width container with centered readable content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors duration-200 mb-6"
            >
              ← Back to Home
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {post.title || post.clean}
            </h1>
            
            {/* Post Meta */}
            <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
              <span className="text-primary-400">By {post.owner.login}</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  ❤️ {post.likes_count}
                </span>
                <span className="flex items-center gap-1">
                  💬 {post.comments_count}
                </span>
              </div>
              {canEdit && (
                <Link 
                  to={`/edit-post/${post.id}`} 
                  className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors duration-200"
                >
                  Edit
                </Link>
              )}
              {canDelete && (
                <button 
                  onClick={handleDelete} 
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                >
                  Delete
                </button>
              )}
            </div>

            {/* Tags and Categories */}
            <div className="space-y-4">
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-300 font-medium">Tags:</span>
                  {post.tags.map(tag => (
                    <Link to={`/tags/${tag.slug}`} key={tag.id}>
                      <span 
                        className="px-3 py-1 rounded-full text-sm text-white hover:opacity-80 transition-opacity duration-200"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
              {post.categories?.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-300 font-medium">Categories:</span>
                  {post.categories.map(category => (
                    <Link to={`/categories/${category.slug}`} key={category.id}>
                      <span 
                        className="px-3 py-1 rounded-md text-sm text-white hover:opacity-80 transition-opacity duration-200"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </header>
        </div>

        {/* Post Content - Full width for images/media, centered for text */}
        <div className={`w-full ${post.feather === 'photo' || post.feather === 'video' ? '' : 'max-w-4xl mx-auto'} mb-8`}>
          <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800">
            <div className="prose prose-invert prose-lg max-w-none">
              {post.feather === 'photo' ? (
                <img
                  src={post.body}
                  alt={post.title || post.clean}
                  className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
                  onClick={() => setLightboxOpen(true)}
                />
              ) : post.feather === 'quote' ? (
                <blockquote className="border-l-4 border-primary-500 pl-6 py-4 bg-gray-800/50 rounded-r-lg italic text-xl text-gray-300 my-6">
                  <ReactMarkdown>{post.body || ''}</ReactMarkdown>
                </blockquote>
              ) : post.feather === 'video' ? (
                <div className="bg-gray-800/50 rounded-lg p-6 my-6 border border-gray-700">
                  <video
                    controls
                    className="w-full h-auto rounded-lg"
                  >
                    <source src={post.body} type="video/mp4" />
                    <source src={post.body} type="video/webm" />
                    <source src={post.body} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                  {post.title && (
                    <p className="mt-4 text-gray-400 italic">{post.title}</p>
                  )}
                </div>
              ) : post.feather === 'audio' ? (
                <div className="bg-gray-800/50 rounded-lg p-6 my-6 border border-gray-700">
                  <audio
                    controls
                    className="w-full max-w-2xl"
                  >
                    <source src={post.body} type="audio/mpeg" />
                    <source src={post.body} type="audio/wav" />
                    <source src={post.body} type="audio/ogg" />
                    Your browser does not support the audio tag.
                  </audio>
                  {post.title && (
                    <p className="mt-4 text-gray-400 italic">{post.title}</p>
                  )}
                </div>
              ) : post.feather === 'link' ? (
                <div>
                  <EmbedPreview url={post.body} content={post.body} />
                  {post.title && (
                    <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <ReactMarkdown
                        components={{
                          a: ({ href, children }) => (
                            <a 
                              href={href} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary-400 hover:text-primary-300 underline font-medium transition-colors duration-200"
                            >
                              {children} 🔗
                            </a>
                          )
                        }}
                      >
                        {post.title}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              ) : (
                <EnhancedContent content={post.body || ''} />
              )}
            </div>
          </div>
        </div>

        {/* Centered footer and comments */}
        <div className="max-w-4xl mx-auto">
          {/* Post Footer */}
          <footer className="flex items-center gap-4 mb-8 p-4 bg-gray-900/50 rounded-lg backdrop-blur-sm border border-gray-800">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isLikedByCurrentUser
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              } ${!currentUser ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={!currentUser}
            >
              ❤️ {isLikedByCurrentUser ? 'Liked' : 'Like'}
            </button>
            <span className="text-gray-400">
              {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}
            </span>
          </footer>

          {/* Comments Section */}
          <div className="bg-gray-900/30 rounded-lg p-6 backdrop-blur-sm border border-gray-800">
            <Comments postId={post.id} currentUser={currentUser} />
          </div>
        </div>

        {/* Lightbox */}
        <Lightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          postId={post.id}
          images={post.feather === 'photo' ? [{ url: post.body, alt: post.title || post.clean }] : []}
        />
      </div>
    </div>
  );
};

export default Post;