// src/components/TagInput.jsx

import { useState } from 'react';

const TagInput = ({ tags, onTagsChange, placeholder = "e.g., python, react, cooking" }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // Convert comma-separated string to array and update parent
        const tagArray = value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        onTagsChange(tagArray);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Optionally add some logic here for better UX
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="w-full px-6 py-4 bg-slate-800/80 backdrop-blur-sm border border-purple-500/30 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 text-lg"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
            </div>
            
            {tags.length > 0 && (
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="text-purple-300 font-semibold">Tags Preview:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                            <span 
                                key={index} 
                                className="px-4 py-2 bg-gradient-to-r from-purple-600/80 to-purple-700/80 text-white text-sm font-medium rounded-full shadow-lg border border-purple-400/30 backdrop-blur-sm"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagInput;