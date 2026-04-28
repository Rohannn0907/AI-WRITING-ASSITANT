import { useState } from 'react';

function ResultDisplay({ improvedText, loading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(improvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="result-display" id="result">
      <div className="section-heading">
        <span>Output</span>
        <h2>Improved Version</h2>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Gemini is refining your text...</p>
        </div>
      ) : improvedText ? (
        <div className="result-content">
          <p>{improvedText}</p>
          <button className="copy-btn" onClick={handleCopy} type="button">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      ) : (
        <div className="empty-state">
          <p>Your improved text will appear here after generation.</p>
        </div>
      )}
    </section>
  );
}

export default ResultDisplay;
