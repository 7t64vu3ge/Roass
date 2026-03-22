import { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import './styles.css';

const API_URL = 'http://localhost:8000/api/review';

const DEFAULT_CODE = `// Paste your code here and click "Review Code"
function greet(name) {
  console.log("Hello, " + name);
}

greet("World");
`;

interface Issue {
  type: string;
  severity: 'low' | 'medium' | 'high';
  line: number | null;
  message: string;
  suggestion: string;
}

interface ReviewResult {
  issues: Issue[];
  summary: string;
}

function App() {
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReview = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const response = await axios.post<ReviewResult>(API_URL, {
        code,
        language: 'javascript',
      });
      setReview(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || 'Failed to get review');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* ===== LEFT: Code Editor ===== */}
      <div className="editor-panel">
        <div className="editor-panel__header">
          <span className="editor-panel__title">Editor</span>
          <span className="editor-panel__lang">JavaScript</span>
        </div>
        <div className="editor-panel__body">
          <Editor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 16 },
              lineNumbers: 'on',
              renderLineHighlight: 'gutter',
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>
      </div>

      {/* ===== RIGHT: Review Panel ===== */}
      <div className="review-panel">
        <div className="review-panel__header">
          <span className="review-panel__title">Review</span>
          <button
            className="review-btn"
            onClick={handleReview}
            disabled={loading || !code.trim()}
          >
            {loading ? 'Reviewing...' : 'Review Code'}
          </button>
        </div>

        <div className="review-content">
          {!loading && !review && !error && (
            <div className="empty-state">
              <div className="empty-state__icon">⌘</div>
              <div className="empty-state__text">
                Write code &amp; hit review
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="loading-spinner" />
              <div className="loading-state__text">Analyzing code...</div>
            </div>
          )}

          {error && (
            <div className="error-state">
              <strong>Error:</strong> {error}
            </div>
          )}

          {review && (
            <>
              {/* Summary */}
              <div className="summary-card">
                <div className="summary-card__label">Summary</div>
                <div className="summary-card__text">{review.summary}</div>
              </div>

              {/* Issues */}
              <div className="issues-header">
                <span>Issues</span>
                <span className="issues-header__count">
                  {review.issues.length}
                </span>
              </div>

              {review.issues.length === 0 ? (
                <div className="no-issues">
                  <div className="no-issues__icon">✓</div>
                  <div className="no-issues__text">No issues found</div>
                </div>
              ) : (
                review.issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`issue-card issue-card--${issue.severity}`}
                  >
                    <div className="issue-card__top">
                      <span className="issue-badge issue-badge--type">
                        {issue.type}
                      </span>
                      <span
                        className={`issue-badge issue-badge--severity-${issue.severity}`}
                      >
                        {issue.severity}
                      </span>
                      {issue.line != null && (
                        <span className="issue-badge issue-badge--line">
                          L{issue.line}
                        </span>
                      )}
                    </div>
                    <div className="issue-card__message">{issue.message}</div>
                    {issue.suggestion && (
                      <div className="issue-card__suggestion">
                        {issue.suggestion}
                      </div>
                    )}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
