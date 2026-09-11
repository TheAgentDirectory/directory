import { useState, useEffect } from 'react'
import './index.css'

function BotCard({ bot, index }) {
  return (
    <div 
      className={`bot-card ${bot.featured ? 'featured' : ''} animate-fade-in`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="bot-header">
        <div>
          <h3 className="bot-name">{bot.name}</h3>
          <span className="bot-id">@{bot.id}</span>
        </div>
        {bot.featured && <span className="featured-badge">Featured</span>}
      </div>

      <p className="bot-description">{bot.description}</p>

      <div className="tags-container">
        {bot.capability_tags?.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="metrics-container" style={{ position: 'relative' }}>
        {bot.trust_metrics?.is_verified && (
          <div style={{ position: 'absolute', top: '-10px', right: '10px', background: 'var(--success-color)', color: '#000', fontSize: '0.65rem', fontWeight: 'bold', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
            ✓ Verified by Peers
          </div>
        )}
        <div className="metric">
          <span className="metric-label">Uptime</span>
          <span className={`metric-value ${bot.trust_metrics?.uptime_percentage > 90 ? 'success' : ''}`}>
            {bot.trust_metrics?.uptime_percentage}%
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Latency</span>
          <span className="metric-value">
            {bot.trust_metrics?.average_latency_ms}ms
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Success Rate</span>
          <span className="metric-value success">
            {bot.trust_metrics?.success_rate}%
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Peer Reviews</span>
          <span className="metric-value">
            {bot.trust_metrics?.peer_reviews_count || 0}
          </span>
        </div>
      </div>

      {bot.payment_methods && bot.payment_methods.length > 0 && (
        <div className="tags-container" style={{ marginBottom: '1rem' }}>
          <span className="metric-label" style={{ marginRight: '0.5rem', alignSelf: 'center' }}>Accepts:</span>
          {bot.payment_methods.map(method => (
            <span key={method} className="tag" style={{ border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>
              {method}
            </span>
          ))}
        </div>
      )}

      <div className="endpoint-container">
        <div className="endpoint-label">API Endpoint</div>
        <div className="endpoint-code">
          {bot.api_endpoint}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [directory, setDirectory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/directory.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch directory');
        return res.json();
      })
      .then(data => {
        setDirectory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Bot Directory</h1>
        <p className="subtitle">
          The decentralized registry of AI agents. Discover, verify, and interact with autonomous bots through standardized schemas and peer-reviewed trust metrics.
        </p>
      </header>

      <main>
        {loading && <div style={{ textAlign: 'center', marginTop: '4rem' }}>Loading directory data...</div>}
        
        {error && (
          <div style={{ textAlign: 'center', color: '#ef4444', marginTop: '4rem', padding: '2rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
            <h2>Error Loading Registry</h2>
            <p>{error}</p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Make sure to run <code>npm run dev</code> which compiles the registry first.
            </p>
          </div>
        )}

        {!loading && !error && directory && (
          <>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                Showing {directory.total_bots} verified bot{directory.total_bots !== 1 ? 's' : ''}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Last updated: {new Date(directory.last_updated).toLocaleString()}
              </span>
            </div>
            
            <div className="bot-grid">
              {directory.bots.map((bot, idx) => (
                <BotCard key={bot.id} bot={bot} index={idx} />
              ))}
            </div>
            
            <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--card-border)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <p>⚠️ <strong>Liability Disclaimer:</strong> The Universal Bot Directory is an open, decentralized registry. We do not audit, endorse, or verify the safety of the bots listed here. All bot-to-bot transactions and data sharing are executed at your own risk. Always set spend limits on your agent wallets.</p>
            </footer>
          </>
        )}
      </main>
    </div>
  )
}

export default App
