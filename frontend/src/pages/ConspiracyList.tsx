import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import ConspiracyCard from '../components/conspiracy/ConspiracyCard'
import { Conspiracy } from '../types'
import { getAllConspiracies } from '../services/arkiv'

const ConspiracyList = () => {
  const { user, setUser } = useApp()
  const navigate = useNavigate()
  const [conspiracies, setConspiracies] = useState<Conspiracy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'upcoming' | 'active' | 'ended'>('active')

  useEffect(() => {
    // Fetch conspiracies from Arkiv
    const loadConspiracies = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllConspiracies()
        
        // Map status based on current time and conspiracy data
        const conspiraciesWithStatus = data.map(c => ({
          ...c,
          status: (c.status || 'active') as 'upcoming' | 'active' | 'ended'
        }))
        
        setConspiracies(conspiraciesWithStatus)
      } catch (err) {
        console.error('Error loading conspiracies:', err)
        setError('Failed to load conspiracies from Arkiv. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadConspiracies()
  }, [])

  const handleRegister = (conspiracyId: string) => {
    if (!user) return
    
    setUser({
      ...user,
      registeredConspiracies: [...(user.registeredConspiracies || []), conspiracyId]
    })
  }

  const filteredConspiracies = conspiracies.filter(c => c.status === filter)

  if (loading) {
    return (
      <div className="missions-page">
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl" style={{ color: '#5a7fa3' }}>Loading conspiracies from Arkiv...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="missions-page">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-xl mb-4" style={{ color: '#ff0040' }}>{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="missions-page landing-page">
      <div className="container mx-auto px-4 py-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Back button */}
            <Link 
              to="/" 
              style={{
                fontSize: '2rem',
                color: '#5a7fa3',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#00ff41'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#5a7fa3'}
            >
              ←
            </Link>
            <h1 className="text-4xl font-bold" style={{ color: '#5a7fa3' }}>Available Conspiracies</h1>
          </div>
        </div>

        {/* Filter Tabs - TSUKI Style */}
        <div className="tab-navigation mb-8">
          <button
            className={`tab-button ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            UPCOMING
          </button>
          <button
            className={`tab-button ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            ACTIVE
          </button>
          <button
            className={`tab-button ${filter === 'ended' ? 'active' : ''}`}
            onClick={() => setFilter('ended')}
          >
            ENDED
          </button>
        </div>

        {/* Registration notice for upcoming conspiracies */}
        {filter === 'upcoming' && (
          <div style={{
            fontSize: '0.75rem',
            color: '#fff',
            fontFamily: 'Courier Prime, monospace',
            letterSpacing: '0.05em',
            marginTop: '-1.5rem',
            marginBottom: '1.5rem',
            paddingLeft: '0.5rem',
            borderLeft: '2px solid #5a7fa3'
          }}>
            REGISTRATION CLOSES AT CONSPIRACY START
          </div>
        )}

        {/* Conspiracies Grid */}
        <div className="missions-grid">
          {filteredConspiracies.map((conspiracy) => (
            <ConspiracyCard 
              key={conspiracy.mystery_id} 
              conspiracy={conspiracy}
              onRegister={handleRegister}
            />
          ))}
        </div>

        {filteredConspiracies.length === 0 && (
          <div className="text-center py-12" style={{ color: '#5a7fa3' }}>
            No {filter} conspiracies available.
          </div>
        )}

        {/* Arkiv Info */}
        <div style={{
          marginTop: '3rem',
          padding: '1rem',
          border: '1px solid #5a7fa3',
          background: 'rgba(90, 127, 163, 0.05)',
          fontSize: '0.8rem',
          color: '#5a7fa3',
          fontFamily: 'Courier Prime, monospace'
        }}>
          <div>🔗 Data source: Arkiv Mendoza Testnet</div>
          <div>📊 Total conspiracies loaded: {conspiracies.length}</div>
        </div>
      </div>
    </div>
  )
}

export default ConspiracyList

