// src/components/MathJaxRenderer.jsx

import { useEffect, useRef } from 'react';

const MathJaxRenderer = ({ content }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    // Load MathJax if not already loaded
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
      script.async = true;
      document.head.appendChild(script);

      const mathJaxScript = document.createElement('script');
      mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      mathJaxScript.async = true;
      document.head.appendChild(mathJaxScript);

      mathJaxScript.onload = () => {
        window.MathJax = {
          tex: {
            inlineMath: [['\\(', '\\)']],
            displayMath: [['\\[', '\\]']],
            processEscapes: true,
            processEnvironments: true
          },
          options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
          }
        };
        renderMath();
      };
    } else {
      renderMath();
    }

    function renderMath() {
      if (contentRef.current && window.MathJax) {
        window.MathJax.typesetPromise([contentRef.current]).catch((err) => {
          console.error('MathJax rendering error:', err);
        });
      }
    }
  }, [content]);

  return (
    <div 
      ref={contentRef}
      className="prose prose-invert prose-purple max-w-none text-gray-100 leading-relaxed"
      style={{
        '--tw-prose-body': 'rgb(243 244 246)',
        '--tw-prose-headings': 'rgb(243 244 246)',
        '--tw-prose-lead': 'rgb(209 213 219)',
        '--tw-prose-links': 'rgb(196 181 253)',
        '--tw-prose-bold': 'rgb(243 244 246)',
        '--tw-prose-counters': 'rgb(168 85 247)',
        '--tw-prose-bullets': 'rgb(168 85 247)',
        '--tw-prose-hr': 'rgb(168 85 247)',
        '--tw-prose-quotes': 'rgb(243 244 246)',
        '--tw-prose-quote-borders': 'rgb(168 85 247)',
        '--tw-prose-captions': 'rgb(209 213 219)',
        '--tw-prose-code': 'rgb(196 181 253)',
        '--tw-prose-pre-code': 'rgb(243 244 246)',
        '--tw-prose-pre-bg': 'rgb(30 41 59)',
        '--tw-prose-th-borders': 'rgb(168 85 247)',
        '--tw-prose-td-borders': 'rgb(75 85 99)',
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default MathJaxRenderer;