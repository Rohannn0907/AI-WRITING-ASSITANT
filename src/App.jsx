import { useState } from 'react';
import './App.css';
import TextEditor from './components/TextEditor';
import ModeSelector from './components/ModeSelector';
import ResultDisplay from './components/ResultDisplay';

const featureCards = [
  {
    title: 'Sharper Voice',
    text: 'Turn rough thoughts into focused writing that sounds clear and intentional.',
  },
  {
    title: 'Tone Control',
    text: 'Move between professional, casual, creative, and concise styles in one click.',
  },
  {
    title: 'Private By Design',
    text: 'Your Gemini key stays on the Flask server and never ships to the browser.',
  },
];

function App() {
  const [inputText, setInputText] = useState('');
  const [improvedText, setImprovedText] = useState('');
  const [selectedMode, setSelectedMode] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('dark');

  const isLightMode = theme === 'light';

  const handleImprove = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text first.');
      return;
    }

    if (inputText.trim().length < 10) {
      setError('Text is too short. Please enter at least 10 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setImprovedText('');

    try {
      const response = await fetch('/api/improve-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          mode: selectedMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to improve text. Please try again.');
      }

      setImprovedText(data.improved_text);
    } catch (err) {
      setError(err.message || 'Failed to connect to server. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app" data-theme={theme}>
      <div className="ambient-bg" />

      <main className="workspace">
        <header className="topbar">
          <a className="brand" href="#composer" aria-label="WritePoint home">
            <span className="brand-mark">AI</span>
            <span>WritePoint</span>
          </a>

          <nav className="topnav" aria-label="Main navigation">
            <a href="#composer">Compose</a>
            <a href="#result">Result</a>
            <a href="#features">Features</a>
          </nav>

          <button
            className="theme-toggle"
            type="button"
            aria-pressed={isLightMode}
            onClick={() => setTheme(isLightMode ? 'dark' : 'light')}
          >
            <span className="toggle-track">
              <span className="toggle-thumb" />
            </span>
            <span>{isLightMode ? 'Light' : 'Dark'}</span>
          </button>
        </header>

        <section className="hero-section">
          <div className="hero-badge">
            <span className="pulse-dot" />
            Powered by Google Gemini
          </div>
          <h1>
            Transform Rough Text Into
            <span> Polished Writing</span>
          </h1>
          <p>
            Paste a message, pick the tone, and generate a cleaner version
            without exposing your API key in the browser.
          </p>
        </section>

        <section className="composer-card" id="composer">
          <TextEditor
            inputText={inputText}
            setInputText={setInputText}
          />

          <div className="composer-actions">
            <ModeSelector
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
            />

            <button
              className="improve-btn"
              disabled={!inputText.trim() || loading}
              onClick={handleImprove}
              type="button"
            >
              {loading ? 'Improving...' : 'Improve Text'}
            </button>
          </div>
        </section>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <ResultDisplay
          improvedText={improvedText}
          loading={loading}
        />

        <section className="feature-grid" id="features">
          {featureCards.map((card) => (
            <article key={card.title} className="feature-card">
              <span>{card.title.slice(0, 2)}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
