import { Link } from 'react-router-dom'
import { Mission } from '../../types'
import { useApp } from '../../contexts/AppContext'
import { useState, useEffect } from 'react'

interface MissionCardProps {
  mission: Mission
  onRegister?: (missionId: string) => void
}

const MissionCard = ({ mission, onRegister }: MissionCardProps) => {
  const { user } = useApp()
  const [glitchText, setGlitchText] = useState('CLASSIFIED')
  const [simulatedRegistration, setSimulatedRegistration] = useState(false)
  
  useEffect(() => {
    // Check if simulated registration exists in localStorage
    const simulated = localStorage.getItem(`simulated-registration-${mission.id}`)
    if (simulated === 'true') {
      setSimulatedRegistration(true)
    }
  }, [mission.id])
  
  const isRegistered = user?.registeredMissions?.includes(mission.id) || simulatedRegistration
  const canRegister = mission.status === 'upcoming' && !isRegistered
  const canAccess = (mission.status === 'active' && isRegistered) || simulatedRegistration

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-GB').replace(/\//g, '-')
  }

  // Glitch animation for hidden title - Random characters version
  useEffect(() => {
    if (mission.status === 'upcoming' && !isRegistered) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'
      const length = 15
      
      const interval = setInterval(() => {
        const randomText = Array.from({ length }, () => 
          chars[Math.floor(Math.random() * chars.length)]
        ).join('')
        setGlitchText(randomText)
      }, 100)
      
      return () => clearInterval(interval)
    }
  }, [mission.status, isRegistered])

  // Calculate progress for upcoming missions
  const calculateProgress = () => {
    if (mission.status !== 'upcoming') return 0
    const now = new Date().getTime()
    const start = new Date(mission.startTime).getTime()
    const creationTime = start - (7 * 24 * 60 * 60 * 1000) // Assume 7 days registration period
    const total = start - creationTime
    const elapsed = now - creationTime
    return Math.min(Math.max((elapsed / total) * 100, 0), 100)
  }

  // For upcoming missions, hide title and description until registered
  const displayTitle = mission.status === 'upcoming' && !isRegistered 
    ? glitchText
    : mission.title

  const displayDescription = mission.status === 'upcoming' && !isRegistered
    ? 'ENCRYPTED UNTIL MISSION STARTS'
    : mission.status === 'upcoming' && isRegistered
    ? 'Mission briefing will be revealed when investigation opens'
    : mission.description

  // Calculate time left to register
  const getTimeLeftToRegister = () => {
    if (mission.status !== 'upcoming') return ''
    const now = new Date().getTime()
    const start = new Date(mission.startTime).getTime()
    const diff = start - now
    
    if (diff <= 0) return '0D 0H 0M 0S'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    return `${days}D ${hours}H ${minutes}M ${seconds}S`
  }

  // Calculate time left for active missions (48h investigation period)
  const getTimeLeftToEnd = () => {
    if (mission.status !== 'active') return ''
    const now = new Date().getTime()
    const end = new Date(mission.endTime).getTime()
    const diff = end - now
    
    if (diff <= 0) return '0H 0M 0S'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    return `${hours}H ${minutes}M ${seconds}S`
  }

  // Mock data for active missions
  const mockActiveInvestigators = 42
  const mockSubmittedSolutions = 17

  return (
    <div className="landing-window mission-card-window" style={{
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background image for active missions - BEHIND everything */}
      {mission.status === 'active' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/background_landing.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          zIndex: 0
        }} />
      )}

      {/* Dark overlay for active missions */}
      {mission.status === 'active' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          pointerEvents: 'none',
          zIndex: 1
        }} />
      )}

      {/* Node header */}
      <div className="node-header" style={{ position: 'relative', zIndex: 2 }}>
        <button className="node-close-button" onClick={(e) => e.preventDefault()}>×</button>
        <div className="node-title" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {mission.status === 'active' ? (
            <>
              <span style={{ color: '#00ff41' }}>ACTIVE</span>
              <span className="active-dot" style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00ff41',
                animation: 'pulse-glow 1.5s ease-in-out infinite'
              }} />
            </>
          ) : (
            mission.status.toUpperCase()
          )}
        </div>
        {isRegistered && mission.status === 'active' && (
          <div className="mission-registered">✓</div>
        )}
      </div>

      {/* Node content */}
      <div className="node-content" style={{ position: 'relative', zIndex: 2 }}>
        {/* Mission ID */}
        <div style={{
          fontSize: '0.7rem',
          color: '#5a7fa3',
          marginBottom: '0.5rem',
          fontFamily: 'Courier Prime, monospace',
          letterSpacing: '0.1em'
        }}>
          MISSION ID: {mission.id.toUpperCase().replace('MISSION-', '')}HA
        </div>

        <h3 className="text-xl font-bold mb-3" style={{ 
          color: mission.status === 'upcoming' && !isRegistered ? '#808080' : '#fff',
          fontFamily: mission.status === 'upcoming' && !isRegistered ? 'Courier Prime, monospace' : 'VT323, monospace',
          letterSpacing: mission.status === 'upcoming' && !isRegistered ? '0.2em' : 'normal',
          fontSize: mission.status === 'active' ? '2rem' : '1.25rem'
        }}>
          {displayTitle}
        </h3>
        
        <p className="text-sm mb-4" style={{
          color: mission.status === 'upcoming' && !isRegistered ? '#808080' : '#b0b0b0',
          lineHeight: '1.5',
          whiteSpace: 'pre-line',
          fontSize: mission.status === 'upcoming' && !isRegistered ? '0.75rem' : '0.875rem'
        }}>
          {displayDescription}
        </p>

        {/* Mission start time - AIRLINE TICKET STYLE */}
        {mission.status === 'upcoming' && (
          <div style={{ 
            marginBottom: '0.75rem',
            fontFamily: 'Courier Prime, monospace',
            letterSpacing: '0.05em'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: '#5a7fa3',
              marginBottom: '0.25rem',
              fontWeight: '500'
            }}>
              MISSION START:
            </div>
            <div style={{
              fontSize: '0.95rem',
              color: '#fff',
              fontWeight: '500'
            }}>
              {new Date(mission.startTime).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }).toUpperCase().replace(/\s/g, ' ')} {new Date(mission.startTime).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
        )}

        {/* Progress bar for upcoming missions */}
        {mission.status === 'upcoming' && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              fontSize: '0.65rem', 
              color: '#5a7fa3', 
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Time Left to Register</span>
              <span style={{ fontWeight: 'bold', color: '#00ff41' }}>{getTimeLeftToRegister()}</span>
            </div>
            <div style={{
              position: 'relative',
              height: '6px',
              background: '#0a0a0a',
              border: '1px solid #5a7fa3',
              overflow: 'hidden'
            }}>
              {/* Background glitch lines */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(90, 127, 163, 0.1) 2px, rgba(90, 127, 163, 0.1) 4px)',
                animation: 'glitchMove 0.3s linear infinite'
              }} />
              {/* Progress bar */}
              <div style={{
                position: 'absolute',
                width: `${calculateProgress()}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #5a7fa3, #00ff41)',
                boxShadow: `0 0 10px rgba(90, 127, 163, 0.5)`,
                transition: 'width 1s linear'
              }} />
              {/* Scanning line */}
              <div style={{
                position: 'absolute',
                width: '2px',
                height: '100%',
                background: '#fff',
                boxShadow: '0 0 5px #fff',
                animation: 'scan 2s linear infinite'
              }} />
            </div>
          </div>
        )}

        {/* Registration price for upcoming missions */}
        {mission.status === 'upcoming' && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            background: 'rgba(90, 127, 163, 0.05)',
            border: '1px solid #5a7fa3'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: '#5a7fa3' }}>Registration Fee:</span>
              <span style={{
                color: '#5a7fa3',
                fontWeight: 'bold',
                fontFamily: 'Courier Prime, monospace'
              }}>
                0.5 KSM
              </span>
            </div>
          </div>
        )}

        {/* Active mission stats and countdown */}
        {mission.status === 'active' && (
          <>
            {/* Time left countdown */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                fontSize: '0.65rem', 
                color: '#00ff41', 
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Investigation Ends In</span>
                <span style={{ fontWeight: 'bold', color: '#00ff41' }}>{getTimeLeftToEnd()}</span>
              </div>
              <div style={{
                position: 'relative',
                height: '6px',
                background: '#0a0a0a',
                border: '1px solid #00ff41',
                overflow: 'hidden'
              }}>
                {/* Background glitch lines */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 255, 65, 0.1) 2px, rgba(0, 255, 65, 0.1) 4px)',
                  animation: 'glitchMove 0.3s linear infinite'
                }} />
                {/* Progress bar */}
                <div style={{
                  position: 'absolute',
                  width: '75%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #00ff41, #00ff41)',
                  boxShadow: `0 0 10px rgba(0, 255, 65, 0.5)`,
                  transition: 'width 1s linear'
                }} />
                {/* Scanning line */}
                <div style={{
                  position: 'absolute',
                  width: '2px',
                  height: '100%',
                  background: '#fff',
                  boxShadow: '0 0 5px #fff',
                  animation: 'scan 2s linear infinite'
                }} />
              </div>
            </div>

            {/* Mission stats */}
            <div style={{
              marginBottom: '1rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem'
            }}>
              <div style={{
                padding: '0.75rem',
                background: 'rgba(90, 127, 163, 0.1)',
                border: '1px solid #5a7fa3'
              }}>
                <div style={{
                  fontSize: '0.55rem',
                  color: '#5a7fa3',
                  marginBottom: '0.25rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: '1.3'
                }}>
                  People Currently Investigating
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  color: '#5a7fa3',
                  fontWeight: 'bold',
                  fontFamily: 'VT323, monospace'
                }}>
                  {mockActiveInvestigators}
                </div>
              </div>

              <div style={{
                padding: '0.75rem',
                background: 'rgba(90, 127, 163, 0.1)',
                border: '1px solid #5a7fa3'
              }}>
                <div style={{
                  fontSize: '0.55rem',
                  color: '#5a7fa3',
                  marginBottom: '0.25rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: '1.3'
                }}>
                  Answers Already Submitted
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  color: '#5a7fa3',
                  fontWeight: 'bold',
                  fontFamily: 'VT323, monospace'
                }}>
                  {mockSubmittedSolutions}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Show dates only for ended missions */}
        {mission.status === 'ended' && (
          <div className="space-y-1 mb-4 text-xs" style={{ color: '#808080' }}>
            <div>Start: {formatDate(mission.startTime)}</div>
            <div>End: {formatDate(mission.endTime)}</div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {canRegister && (
            <button
              onClick={() => onRegister?.(mission.id)}
              className="mission-btn mission-btn-primary"
              style={{ fontWeight: 'bold' }}
            >
              REGISTER
            </button>
          )}

          {isRegistered && mission.status === 'upcoming' && (
            <div className="text-center text-sm" style={{ color: '#5a7fa3' }}>
              Registered
            </div>
          )}

          {canAccess && (
            <Link to={`/mission/${mission.id}`} className="mission-btn mission-btn-primary">
              See Mission Details
            </Link>
          )}

          {mission.status === 'ended' && (
            <Link to={`/mission/${mission.id}/results`} className="mission-btn mission-btn-secondary">
              View Results
            </Link>
          )}

          {!isRegistered && mission.status === 'active' && (
            <>
              <div className="text-center" style={{ 
                color: '#ff0040',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontFamily: 'Courier Prime, monospace'
              }}>
                You haven't registered for this mission
              </div>
              <button
                onClick={() => {
                  setSimulatedRegistration(true)
                  localStorage.setItem(`simulated-registration-${mission.id}`, 'true')
                }}
                className="mission-btn mission-btn-secondary"
                style={{ 
                  fontSize: '0.7rem',
                  padding: '0.5rem',
                  opacity: 0.7,
                  border: '1px dashed #5a7fa3'
                }}
              >
                FOR SUB0 JURY: SIMULATE REGISTRATION
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MissionCard
