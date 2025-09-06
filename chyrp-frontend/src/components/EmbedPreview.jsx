// src/components/EmbedPreview.jsx

import { useState, useEffect } from 'react';
import apiClient from '../api';

const EmbedPreview = ({ url, content }) => {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (url || content) {
      fetchEmbedPreview();
    }
  }, [url, content]);

  const fetchEmbedPreview = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/embed/preview', null, {
        params: {
          url: url,
          content: content
        }
      });
      
      setPreview(response.data);
    } catch (error) {
      console.error('Failed to fetch embed preview:', error);
      setError('Failed to load embed preview');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-8 shadow-2xl shadow-purple-900/20">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          <span className="text-purple-300 font-medium">Loading preview...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-lg rounded-2xl border border-red-500/30 p-8 shadow-2xl shadow-red-900/20">
        <div className="flex items-center justify-center space-x-3 text-red-400">
          <div className="text-2xl">⚠️</div>
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (!preview) {
    return null;
  }

  return (
    <div className="my-8">
      <div className="bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/20 shadow-2xl shadow-purple-900/20 overflow-hidden transition-all duration-300 hover:border-purple-400/40 hover:shadow-3xl hover:shadow-purple-900/30 group">
        {preview.image && (
          <div className="relative overflow-hidden">
            <img 
              src={preview.image} 
              alt={preview.title || 'Preview'} 
              className="w-full h-48 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
          </div>
        )}
        
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            {preview.favicon && (
              <img 
                src={preview.favicon} 
                alt="" 
                className="w-6 h-6 rounded-sm"
              />
            )}
            <span className="text-purple-300 font-medium text-sm tracking-wide uppercase">
              {preview.site_name}
            </span>
          </div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-white to-purple-300 bg-clip-text leading-tight">
            <a 
              href={preview.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity duration-200"
            >
              {preview.title}
            </a>
          </h3>
          
          {preview.description && (
            <p className="text-gray-300 leading-relaxed text-lg">
              {preview.description}
            </p>
          )}
          
          <div className="pt-4 border-t border-purple-500/20">
            <div className="flex items-center justify-between">
              <span className="text-purple-400 text-sm font-mono truncate">
                {preview.url}
              </span>
              <a 
                href={preview.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600/80 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
              >
                <span>Visit</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedPreview;