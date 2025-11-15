import WalletConnect from '../components/wallet/WalletConnect'

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Single central node */}
      <div className="landing-window landing-window-center">
        <div className="node-header">
          <button className="node-close-button" onClick={(e) => e.preventDefault()}>×</button>
          <div className="node-title">ACCESS PROTOCOL</div>
        </div>
        <div className="node-content" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <h1 className="font-bold mb-4" style={{ color: 'var(--text-primary)', fontSize: '6rem', lineHeight: '1' }}>48_REDACTED</h1>
          <p className="text-xl mb-4" style={{ color: '#5a7fa3' }}>&gt; solve the quest</p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Time-limited investigations.<br />
            Evidences stored on Arxiv.<br />
            Kusama.
          </p>
          
          {/* Wallet connection */}
          <div style={{ marginTop: '2rem' }}>
            <WalletConnect />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
