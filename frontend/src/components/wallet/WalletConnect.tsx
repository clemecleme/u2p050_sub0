import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrowserProvider } from 'ethers'
import { useApp } from '../../contexts/AppContext'
import { setAuthToken } from '../../services/api'

const WalletConnect = () => {
  const { user, setUser } = useApp()
  const navigate = useNavigate()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMetaMask, setHasMetaMask] = useState(false)

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      setHasMetaMask(true)
    }
  }, [])

  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed')
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const address = accounts[0]
      setAuthToken(address)
      
      // Clear any simulated registrations from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('simulated-registration-')) {
          localStorage.removeItem(key)
        }
      })
      
      setUser({
        address,
        registeredMissions: [],
      })

      // Navigate to missions after connection
      navigate('/missions')
    } catch (err: any) {
      console.error('Error connecting wallet:', err)
      if (err.code === 4001) {
        setError('Connection rejected by user')
      } else {
        setError(err.message || 'Failed to connect wallet')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setUser(null)
    setAuthToken(null)
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Show user info if connected
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="bg-dark-800 border border-main-color px-4 py-2">
          <div className="text-xs text-gray-400 mb-1">Connected</div>
          <div className="text-sm font-mono text-main-color">
            {truncateAddress(user.address)}
          </div>
        </div>
        <button
          onClick={disconnectWallet}
          className="btn-secondary text-sm"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="flex flex-col gap-4">
        {/* Connect Wallet Button */}
        {hasMetaMask ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="btn-primary text-lg px-8 py-3"
          >
            {isConnecting ? 'Connecting...' : '🦊 Connect MetaMask'}
          </button>
        ) : (
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-lg px-8 py-3 inline-block"
          >
            Install MetaMask
          </a>
        )}
      </div>
      
      {error && (
        <div className="mt-4 bg-red-900/30 border border-red-700 p-3 max-w-md mx-auto">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <p className="text-gray-400 text-sm mt-4">
        Connect your wallet to access missions
      </p>
    </div>
  )
}

export default WalletConnect
