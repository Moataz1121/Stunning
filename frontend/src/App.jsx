import { useState } from 'react';
import { generateArchitecture } from './services/api';
import './App.css';

const AVAILABLE_INTEGRATIONS = [
  { id: 'Stripe', name: 'Stripe', icon: '💳' },
  { id: 'Shopify', name: 'Shopify', icon: '🛍️' },
  { id: 'Gmail', name: 'Gmail', icon: '✉️' },
  { id: 'Slack', name: 'Slack', icon: '💬' },
  { id: 'Google Sheets', name: 'Google Sheets', icon: '📊' },
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [selectedIntegrations, setSelectedIntegrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const toggleIntegration = (id) => {
    setSelectedIntegrations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isSubmitDisabled = prompt.trim().length < 10 || loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedResult = await generateArchitecture(
        prompt,
        selectedIntegrations,
      );
      setResult(generatedResult);
    } catch (err) {
      setError(
        err.message || 'Failed to generate response. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header / Hero Section */}
      <header className="hero-section">
        <div className="badge">AI Application Builder</div>
        <h1>Describe what you want to build</h1>
        <p className="hero-subtitle">
          Turn your software idea into a complete architecture specification with dummy context integrations.
        </p>
      </header>

      {/* Main Form Card */}
      <main className="builder-card">
        <form onSubmit={handleSubmit}>
          {/* Prompt Textarea */}
          <div className="form-group">
            <label htmlFor="prompt-input" className="form-label">
              Your App Prompt <span className="required-star">*</span>
            </label>
            <textarea
              id="prompt-input"
              className="prompt-textarea"
              rows={5}
              placeholder="e.g. Build a SaaS subscription platform that processes customer payments and sends real-time notifications to our team..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              maxLength={2000}
            />
            <div className="prompt-meta">
              <span
                className={`char-count ${
                  prompt.trim().length > 0 && prompt.trim().length < 10
                    ? 'warning'
                    : ''
                }`}
              >
                {prompt.length} / 2000 characters{' '}
                {prompt.length > 0 && prompt.trim().length < 10
                  ? '(minimum 10 required)'
                  : ''}
              </span>
            </div>
          </div>

          {/* Dummy Integrations Selector */}
          <div className="form-group">
            <label className="form-label">
              Select Context Integrations{' '}
              <span className="label-subtext">(Dummy capabilities to inject into AI context)</span>
            </label>
            <div className="integrations-grid">
              {AVAILABLE_INTEGRATIONS.map((integration) => {
                const isSelected = selectedIntegrations.includes(
                  integration.id,
                );
                return (
                  <button
                    key={integration.id}
                    type="button"
                    className={`integration-pill ${
                      isSelected ? 'selected' : ''
                    }`}
                    onClick={() => toggleIntegration(integration.id)}
                    disabled={loading}
                    aria-pressed={isSelected}
                  >
                    <span className="integration-icon">
                      {integration.icon}
                    </span>
                    <span className="integration-name">
                      {integration.name}
                    </span>
                    {isSelected && <span className="check-mark">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Action Button */}
          <div className="action-row">
            <button
              type="submit"
              className="generate-btn"
              disabled={isSubmitDisabled}
            >
              {loading ? (
                <>
                  <span className="spinner" /> Generating AI Architecture...
                </>
              ) : (
                'Generate AI Architecture'
              )}
            </button>
          </div>
        </form>

        {/* Error Banner State */}
        {error && (
          <div className="error-banner" role="alert">
            <span className="error-icon">⚠️</span>
            <div className="error-content">
              <strong>Generation Error</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Loading Spinner State */}
        {loading && (
          <div className="loading-container">
            <div className="spinner-lg" />
            <p>Analyzing prompt and building system architecture...</p>
          </div>
        )}

        {/* AI Result Display Area */}
        {result && !loading && (
          <section className="result-section" aria-label="AI Generated Result">
            <div className="result-header">
              <h2>Generated Architecture & Specification</h2>
            </div>
            <div className="result-content">
              <pre className="result-text">{result}</pre>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
