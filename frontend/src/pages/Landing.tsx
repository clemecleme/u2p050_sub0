import { Link } from 'react-router-dom'
import WalletConnect from '../components/wallet/WalletConnect'

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Single central node */}
      <div className="landing-window landing-window-center">
        <div className="node-header">
          <div className="node-title">ACCESS PROTOCOL</div>
        </div>
        <div className="node-content" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <h1 className="font-bold mb-4" style={{ color: 'var(--text-primary)', fontSize: '6rem', lineHeight: '1' }}>INFINITE CONSPIRACY</h1>
          <p className="text-xl mb-4" style={{ color: '#5a7fa3' }}>&gt; solve the quest</p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Time-limited investigations.<br />
            Evidence on Arkiv.<br />
            Powered on Kusama.
          </p>
          
          {/* Quick access button */}
          <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
            <Link to="/conspiracies">
              <button className="btn-primary text-lg px-8 py-3">
                🔍 Browse Conspiracies
              </button>
            </Link>
          </div>
          
          {/* Wallet connection */}
          <div style={{ marginTop: '1rem' }}>
            <WalletConnect />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
