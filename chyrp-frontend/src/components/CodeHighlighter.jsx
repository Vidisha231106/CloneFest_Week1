// src/components/CodeHighlighter.jsx

import { useState, useEffect } from 'react';
import apiClient from '../api';

const CodeHighlighter = ({ content }) => {
  const [highlightedContent, setHighlightedContent] = useState(content);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (content && content.includes('```')) {
      processCodeBlocks();
    } else {
      setHighlightedContent(content);
    }
  }, [content]);

  const processCodeBlocks = async () => {
    setLoading(true);
    try {
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
      let processedContent = content;
      let match;
      let blockIndex = 0;

      while ((match = codeBlockRegex.exec(content)) !== null) {
        const [fullMatch, language, code] = match;
        const blockId = `code-block-${blockIndex++}`;
        
        try {
          const response = await apiClient.post('/highlighter/highlight', null, {
            params: {
              code: code.trim(),
              language: language || 'text'
            }
          });
          
          const highlightedCode = response.data.code;
          const highlightedBlock = `
            <div class="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-2xl shadow-purple-900/20 overflow-hidden mb-6 transition-all duration-300 hover:border-purple-400/40 hover:shadow-3xl hover:shadow-purple-900/30" data-language="${language || 'text'}">
              <div class="bg-gradient-to-r from-purple-900/40 to-slate-800/60 px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
                <span class="text-purple-300 font-mono text-sm font-semibold tracking-wide uppercase">${language || 'text'}</span>
                <button 
                  onclick="copyToClipboard('${blockId}')" 
                  class="px-4 py-2 bg-purple-600/80 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
                >
                  Copy
                </button>
              </div>
              <pre class="p-6 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent" id="${blockId}">
                <code class="text-gray-100 font-mono text-sm leading-relaxed">${highlightedCode}</code>
              </pre>
            </div>
          `;
          
          processedContent = processedContent.replace(fullMatch, highlightedBlock);
        } catch (error) {
          console.error('Failed to highlight code block:', error);
          const fallbackBlock = `
            <div class="bg-slate-900/80 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-2xl shadow-purple-900/20 overflow-hidden mb-6 transition-all duration-300 hover:border-purple-400/40" data-language="${language || 'text'}">
              <div class="bg-gradient-to-r from-purple-900/40 to-slate-800/60 px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
                <span class="text-purple-300 font-mono text-sm font-semibold tracking-wide uppercase">${language || 'text'}</span>
                <button 
                  onclick="copyToClipboard('${blockId}')" 
                  class="px-4 py-2 bg-purple-600/80 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
                >
                  Copy
                </button>
              </div>
              <pre class="p-6 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent" id="${blockId}">
                <code class="text-gray-100 font-mono text-sm leading-relaxed">${code.trim()}</code>
              </pre>
            </div>
          `;
          processedContent = processedContent.replace(fullMatch, fallbackBlock);
        }
      }

      setHighlightedContent(processedContent);
    } catch (error) {
      console.error('Error processing code blocks:', error);
      setHighlightedContent(content);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.copyToClipboard = (elementId) => {
      const element = document.getElementById(elementId);
      if (element) {
        const text = element.textContent;
        navigator.clipboard.writeText(text).then(() => {
          const button = element.parentElement.querySelector('button');
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          button.className = button.className.replace('bg-purple-600/80 hover:bg-purple-500', 'bg-green-600 hover:bg-green-500');
          setTimeout(() => {
            button.textContent = originalText;
            button.className = button.className.replace('bg-green-600 hover:bg-green-500', 'bg-purple-600/80 hover:bg-purple-500');
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          <span className="text-purple-300 font-medium">Processing code blocks...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="prose prose-invert prose-purple max-w-none"
      dangerouslySetInnerHTML={{ __html: highlightedContent }}
    />
  );
};

export default CodeHighlighter;