// src/components/Comments.jsx

import { useState, useEffect } from 'react';
import apiClient from '../api';

const Comments = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [maptchaChallenge, setMaptchaChallenge] = useState(null);
  const [maptchaAnswer, setMaptchaAnswer] = useState('');

  useEffect(() => {
    fetchComments();
    fetchMaptchaChallenge();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await apiClient.get(`/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaptchaChallenge = async () => {
    try {
      const response = await apiClient.post('/maptcha/generate');
      setMaptchaChallenge(response.data);
    } catch (error) {
      console.error('Failed to fetch MAPTCHA challenge:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        content: newComment,
        maptcha_challenge_id: maptchaChallenge.challenge_id,
        maptcha_answer: maptchaAnswer
      };

      const response = await apiClient.post(
        `/posts/${postId}/comments/with-maptcha`,
        payload
      );

      setComments([response.data, ...comments]);
      setNewComment('');
      setMaptchaAnswer('');
      fetchMaptchaChallenge();
    } catch (error) {
      alert('Failed to submit comment. Please check your answer to the math question.');
      console.error('Comment submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-8 shadow-2xl shadow-purple-900/20">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
          <span className="text-purple-300 font-medium">Loading comments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-8 shadow-2xl shadow-purple-900/20 transition-all duration-300 hover:border-purple-400/40">
      <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text mb-8 text-center">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-10 space-y-6">
        <div className="space-y-3">
          <label htmlFor="comment" className="block text-lg font-semibold text-purple-300 tracking-wide">
            Add a comment:
          </label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows="4"
            required
            className="w-full px-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl text-gray-100 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 shadow-inner shadow-purple-900/10"
          />
        </div>

        {/* MAPTCHA Challenge */}
        {maptchaChallenge && (
          <div className="bg-purple-900/20 rounded-xl p-6 border border-purple-500/30 space-y-3">
            <label htmlFor="maptcha-answer" className="block text-purple-300 font-medium">
              Spam protection: <span className="text-white font-semibold">{maptchaChallenge.question}</span>
            </label>
            <input
              id="maptcha-answer"
              type="number"
              value={maptchaAnswer}
              onChange={(e) => setMaptchaAnswer(e.target.value)}
              placeholder="Your answer"
              required
              className="w-full px-4 py-3 bg-slate-800/80 border border-purple-500/30 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button 
            type="submit" 
            disabled={submitting || !currentUser}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 hover:from-purple-700 hover:via-purple-800 hover:to-purple-700 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
          >
            {submitting ? (
              <span className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </span>
            ) : (
              'Submit Comment'
            )}
          </button>

          {!currentUser && (
            <p className="text-gray-400 text-center">
              Please <a href="/login" className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200">login</a> to post comments.
            </p>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-xl text-gray-400">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 transition-all duration-300 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-900/20">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {comment.author.login.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-purple-300 font-semibold text-lg">{comment.author.login}</span>
                    <div className="text-gray-400 text-sm">{formatDate(comment.created_at)}</div>
                  </div>
                </div>
              </div>
              <div className="text-gray-100 leading-relaxed text-lg">
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;