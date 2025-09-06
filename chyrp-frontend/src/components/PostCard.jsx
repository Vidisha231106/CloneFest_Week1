import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500 shadow-2xl shadow-purple-900/20 hover:shadow-3xl hover:shadow-purple-900/30 transform hover:-translate-y-2 w-full">
      <div className="p-8">
        <h3 className="text-2xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-purple-300 via-white to-purple-400 bg-clip-text mb-6 leading-tight group-hover:from-purple-400 group-hover:via-purple-200 group-hover:to-purple-500 transition-all duration-300">
          <Link to={`/posts/${post.id}`} className="hover:opacity-90">
            {post.title || post.clean}
          </Link>
        </h3>

        {/* Enhanced content display for different post types */}
        <div className="mb-8">
          {post.feather === 'photo' ? (
            <Link to={`/posts/${post.id}`} className="block">
              <img
                src={post.body}
                alt={post.title || post.clean}
                className="w-full h-64 lg:h-80 object-cover rounded-2xl transition-all duration-500 group-hover:scale-105 shadow-2xl shadow-purple-900/30"
              />
            </Link>
          ) : post.feather === 'video' ? (
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-8 border border-purple-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-2xl">
                  🎥
                </div>
                <strong className="text-purple-300 text-xl font-semibold">Video Post</strong>
              </div>
              <video
                controls
                className="w-full max-h-64 rounded-xl shadow-lg"
              >
                <source src={post.body} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {post.title && (
                <p className="mt-4 text-gray-300 italic text-lg">{post.title}</p>
              )}
            </div>
          ) : post.feather === 'audio' ? (
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-2xl p-8 border border-purple-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-2xl">
                  🎵
                </div>
                <strong className="text-purple-300 text-xl font-semibold">Audio Post</strong>
              </div>
              <audio
                controls
                className="w-full rounded-xl"
              >
                <source src={post.body} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
              {post.title && (
                <p className="mt-4 text-gray-300 italic text-lg">{post.title}</p>
              )}
            </div>
          ) : post.feather === 'link' ? (
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                  🔗
                </div>
                <strong className="text-purple-300 text-xl font-semibold">Link Post</strong>
              </div>
              {(() => {
                const urlMatch = post.body?.match(/https?:\/\/[^\s]+/);
                const url = urlMatch ? urlMatch[0] : null;
                return url ? (
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-3 text-purple-300 hover:text-purple-200 text-xl font-medium transition-all duration-300 hover:scale-105"
                  >
                    {post.title || 'Shared Link'} 
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-gray-300 text-xl">{post.title || 'Shared Link'}</span>
                );
              })()}
            </div>
          ) : post.feather === 'quote' ? (
            <blockquote className="border-l-4 border-purple-500 pl-8 py-6 bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-r-2xl backdrop-blur-sm">
              <div className="text-4xl text-purple-400 mb-4">"</div>
              <p className="text-gray-100 text-xl lg:text-2xl leading-relaxed italic font-medium">
                {post.body ? `${post.body.substring(0, 200)}${post.body.length > 200 ? '...' : ''}` : 'This is a quote post.'}
              </p>
              <div className="text-4xl text-purple-400 text-right mt-4">"</div>
            </blockquote>
          ) : (
            <div className="prose prose-invert prose-purple max-w-none">
              <p className="text-gray-200 leading-relaxed text-lg lg:text-xl">
                {post.body ? `${post.body.substring(0, 200)}${post.body.length > 200 ? '...' : ''}` : 'This is a feather post.'}
              </p>
            </div>
          )}
        </div>

        {/* Post Meta */}
        <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8 pb-6 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{post.owner.login.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-purple-300 font-semibold text-lg">By {post.owner.login}</span>
          </div>
          <span className="text-gray-400 text-lg">{formatDate(post.created_at)}</span>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-lg">
              <span className="text-red-400">❤️</span>
              <span className="font-semibold">{post.likes_count}</span>
            </span>
            <span className="flex items-center gap-2 text-lg">
              <span className="text-blue-400">💬</span>
              <span className="font-semibold">{post.comments_count}</span>
            </span>
          </div>
        </div>

        {/* Tags and Categories */}
        {(post.tags?.length > 0 || post.categories?.length > 0) && (
          <div className="space-y-4 mb-8">
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {post.tags.slice(0, 3).map(tag => (
                  <Link to={`/tags/${tag.slug}`} key={tag.id}>
                    <span 
                      className="px-4 py-2 rounded-full text-sm font-semibold text-white hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      style={{ backgroundColor: tag.color }}
                    >
                      #{tag.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {post.categories?.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {post.categories.map(category => (
                  <Link to={`/categories/${category.slug}`} key={category.id}>
                    <span 
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-80 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Read More Link */}
        <Link 
          to={`/posts/${post.id}`} 
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 hover:from-purple-700 hover:via-purple-800 hover:to-purple-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-900/40 hover:shadow-xl hover:shadow-purple-900/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
        >
          Read More 
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
};

export default PostCard;