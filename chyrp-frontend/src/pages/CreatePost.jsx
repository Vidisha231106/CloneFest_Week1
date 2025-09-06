import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import './CreatePost.css';

const CreatePost = () => {
  // --- STATE MANAGEMENT ---
  const [title, setTitle] = useState('');
  const [clean, setClean] = useState('');
  const [isPage, setIsPage] = useState(false);
  const [feather, setFeather] = useState('text'); // The state for Post Type
  const [status, setStatus] = useState('draft');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // State for different post content
  const [body, setBody] = useState(''); // For text posts
  const [file, setFile] = useState(null); // For photo, video, audio
  const [quote, setQuote] = useState('');
  const [attribution, setAttribution] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  // State for tags and categories
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // --- NEW: State for AI processing ---
  const [isEnhancing, setIsEnhancing] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/categories');
        setAllCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategoryId(response.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // --- NEW: Handler for the AI button ---
  const handleEnhanceWithAI = async () => {
    if (!body.trim()) {
      setError("Please write some text before enhancing with AI.");
      return;
    }
    setError('');
    setIsEnhancing(true);
    try {
      const response = await apiClient.post('/ai/enhance', { text: body });
      setBody(response.data.enhanced_text); // Update the textarea with AI content
    } catch (err) {
      const detail = err?.response?.data?.detail || "Failed to enhance text. Please try again.";
      setError(`AI Error: ${detail}`);
    } finally {
      setIsEnhancing(false);
    }
  };

  // --- HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // For post types that involve file uploads (photo, video, audio)
      if (['photo', 'video', 'audio'].includes(feather)) {
        if (!file) { setError(`Please choose a ${feather} file.`); return; }
        const form = new FormData();
        form.append('clean', clean);
        form.append('title', title);
        form.append('status', status);
        form.append('category_ids', JSON.stringify([parseInt(selectedCategoryId)]));
        form.append('tags', JSON.stringify(tagsInput.split(',').map(tag => tag.trim()).filter(Boolean)));
        form.append('file', file);
        await apiClient.post(`/posts/${feather}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      // For post types that use form data but no files (quote, link)
      else if (['quote', 'link'].includes(feather)) {
        const form = new FormData();
        form.append('clean', clean);
        form.append('status', status);
        form.append('category_ids', JSON.stringify([parseInt(selectedCategoryId)]));
        form.append('tags', JSON.stringify(tagsInput.split(',').map(tag => tag.trim()).filter(Boolean)));
        if (feather === 'quote') {
            form.append('quote', quote);
            form.append('attribution', attribution);
        } else { // link
            form.append('title', title);
            form.append('url', url);
            form.append('description', description);
        }
        await apiClient.post(`/posts/${feather}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      // For standard text posts
      else {
        const postData = {
          content_type: isPage ? 'page' : 'post',
          title, body, clean, status,
          feather: 'text',
          tags: tagsInput.split(',').map(tag => tag.trim()).filter(Boolean),
          category_ids: [parseInt(selectedCategoryId)],
        };
        await apiClient.post('/posts/', postData);
      }
      
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to create post.');
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          Create New {isPage ? 'Page' : 'Post'}
        </h1>
        
        <div className="flex items-center gap-2 mb-6">
          <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isPage} 
              onChange={(e) => setIsPage(e.target.checked)}
              className="rounded bg-slate-800 border-purple-500/20 text-purple-500 focus:ring-purple-500/20" 
            />
            Create as a static page
          </label>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type Selection */}
          <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Post Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'text', label: 'Text', icon: '📝' },
                { value: 'photo', label: 'Photo', icon: '📷' },
                { value: 'quote', label: 'Quote', icon: '💭' },
                { value: 'link', label: 'Link', icon: '🔗' },
                { value: 'video', label: 'Video', icon: '🎥' },
                { value: 'audio', label: 'Audio', icon: '🎵' }
              ].map(type => (
                <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="feather" 
                    value={type.value} 
                    checked={feather === type.value} 
                    onChange={() => setFeather(type.value)}
                    className="text-purple-500 focus:ring-purple-500/20"
                  />
                  <span className="text-gray-300">{type.icon} {type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Title Field (hidden for quotes) */}
          {feather !== 'quote' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter post title..." 
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                required 
              />
            </div>
          )}

          {/* URL Slug */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">URL Slug</label>
            <input 
              type="text" 
              value={clean} 
              onChange={(e) => setClean(e.target.value)} 
              placeholder="my-awesome-post" 
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
              required 
            />
          </div>

          {/* Dynamic Content Fields */}
          <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Content</h3>
            
            {feather === 'text' && (
              <div className="space-y-4">
                <div className="relative">
                  <textarea 
                    value={body} 
                    onChange={(e) => setBody(e.target.value)} 
                    placeholder="Write your content..." 
                    rows={15}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 resize-none"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleEnhanceWithAI} 
                  disabled={isEnhancing}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isEnhancing ? 'Enhancing...' : '✨ Enhance with AI'}
                </button>
              </div>
            )}

            {feather === 'photo' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Choose Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all duration-200"
                />
              </div>
            )}

            {feather === 'video' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Choose Video</label>
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all duration-200"
                />
              </div>
            )}

            {feather === 'audio' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Choose Audio</label>
                <input 
                  type="file" 
                  accept="audio/*" 
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all duration-200"
                />
              </div>
            )}

            {feather === 'quote' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Quote Text</label>
                  <textarea 
                    value={quote} 
                    onChange={(e) => setQuote(e.target.value)} 
                    placeholder="Enter the quote..." 
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Attribution</label>
                  <input 
                    type="text" 
                    value={attribution} 
                    onChange={(e) => setAttribution(e.target.value)} 
                    placeholder="Albert Einstein"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {feather === 'link' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">URL</label>
                  <input 
                    type="url" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Description (Optional)</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Optional description..." 
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Taxonomy Selectors */}
          <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Organization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Category</label>
                <select 
                  value={selectedCategoryId} 
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                >
                  {allCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Tags</label>
                <input 
                  type="text" 
                  value={tagsInput} 
                  onChange={(e) => setTagsInput(e.target.value)} 
                  placeholder="python, react, cooking"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                />
                <p className="text-xs text-gray-500">Separate tags with commas</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800">
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
            >
              <option value="draft">Save as Draft</option>
              <option value="public">Publish</option>
            </select>
            
            <button 
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {status === 'draft' ? 'Save Draft' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;