// src/components/MultiFileUploader.jsx

import { useState } from 'react';
import apiClient from '../api';

const MultiFileUploader = ({ onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError('');
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select files to upload.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await apiClient.post('/uploads/multi', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (onUploadComplete) {
        onUploadComplete(response.data.urls);
      }
      
      setFiles([]);
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError(err?.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-8 shadow-2xl shadow-purple-900/20 transition-all duration-300 hover:border-purple-400/40">
      <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text mb-8 text-center">
        Multi-File Uploader
      </h3>
      
      <div className="space-y-6">
        <div className="border-2 border-dashed border-purple-500/30 rounded-xl p-8 transition-all duration-300 hover:border-purple-400/50 hover:bg-purple-500/5">
          <label className="block cursor-pointer">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-purple-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-lg font-semibold text-purple-300 mb-2">Choose multiple files</div>
              <div className="text-gray-400">Click to browse or drag and drop</div>
            </div>
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {files.length > 0 && (
          <div className="bg-slate-800/60 rounded-xl p-6 border border-purple-500/20">
            <h4 className="text-lg font-semibold text-purple-300 mb-4">
              Selected Files ({files.length}):
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-200 font-medium">{file.name}</span>
                  </div>
                  <span className="text-purple-300 text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-300 text-center font-medium">{error}</p>
          </div>
        )}

        <button 
          onClick={handleUpload} 
          disabled={uploading || files.length === 0}
          className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 hover:from-purple-700 hover:via-purple-800 hover:to-purple-700 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
        >
          {uploading ? (
            <span className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              <span>Uploading...</span>
            </span>
          ) : (
            `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`
          )}
        </button>
      </div>
    </div>
  );
};

export default MultiFileUploader;