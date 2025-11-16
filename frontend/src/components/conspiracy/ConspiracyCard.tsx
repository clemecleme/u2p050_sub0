import { Link } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { Conspiracy } from '../../types'
import Timer from '../mission/Timer'

interface ConspiracyCardProps {
  conspiracy: Conspiracy
  onRegister: (conspiracyId: string) => void
}

const ConspiracyCard = ({ conspiracy, onRegister }: ConspiracyCardProps) => {
  const { user } = useApp()
  
  // Check if user is registered
  const isRegistered = user?.registeredConspiracies?.includes(conspiracy.mystery_id) || false
  
  // Check simulated registration from localStorage
  const simulatedRegistration = localStorage.getItem(`simulated-registration-${conspiracy.mystery_id}`) === 'true'
  const isEffectivelyRegistered = isRegistered || simulatedRegistration
  
  // Determine if user can access the board
  // TODO: Re-enable registration requirement later
  const canAccessBoard = true // Allow access for development/testing
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return '#00ff41'
    if (difficulty <= 6) return '#ffff00'
    return '#ff0040'
  }
  
  // Get conspiracy type badge color
  const getTypeColor = (type: string | undefined) => {
    if (!type) return '#5a7fa3'
    const colors: Record<string, string> = {
      occult: '#9370DB',
      political: '#DC143C',
      corporate: '#4682B4',
      scientific: '#32CD32',
      criminal: '#FF4500',
    }
    return colors[type.toLowerCase()] || '#5a7fa3'
  }
  
  return (
    <div 
      className="landing-window" 
      style={{ 
        padding: '1.5rem',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '0.5rem'
        }}>
          <h2 style={{ 
            fontSize: '1.2rem', 
            color: '#5a7fa3',
            margin: 0,
            flex: 1
          }}>
            {conspiracy.conspiracy_name}
          </h2>
        </div>
        
        {/* Metadata badges */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '0.5rem'
        }}>
          {conspiracy.conspiracy_type && (
            <span style={{
              fontSize: '0.7rem',
              padding: '0.25rem 0.5rem',
              background: `rgba(${parseInt(getTypeColor(conspiracy.conspiracy_type).slice(1, 3), 16)}, ${parseInt(getTypeColor(conspiracy.conspiracy_type).slice(3, 5), 16)}, ${parseInt(getTypeColor(conspiracy.conspiracy_type).slice(5, 7), 16)}, 0.2)`,
              border: `1px solid ${getTypeColor(conspiracy.conspiracy_type)}`,
              color: getTypeColor(conspiracy.conspiracy_type),
              fontFamily: 'Courier Prime, monospace'
            }}>
              {conspiracy.conspiracy_type.toUpperCase()}
            </span>
          )}
          
          <span style={{
            fontSize: '0.7rem',
            padding: '0.25rem 0.5rem',
            background: `rgba(${parseInt(getDifficultyColor(conspiracy.difficulty).slice(1, 3), 16)}, ${parseInt(getDifficultyColor(conspiracy.difficulty).slice(3, 5), 16)}, ${parseInt(getDifficultyColor(conspiracy.difficulty).slice(5, 7), 16)}, 0.2)`,
            border: `1px solid ${getDifficultyColor(conspiracy.difficulty)}`,
            color: getDifficultyColor(conspiracy.difficulty),
            fontFamily: 'Courier Prime, monospace'
          }}>
            DIFFICULTY: {conspiracy.difficulty}/10
          </span>
        </div>
        
        {/* World */}
        <div style={{
          fontSize: '0.8rem',
          color: '#00ff41',
          fontFamily: 'Courier Prime, monospace',
          marginBottom: '0.5rem'
        }}>
          🌍 {conspiracy.world}
        </div>
        
        {/* Documents count */}
        <div style={{
          fontSize: '0.75rem',
          color: '#5a7fa3',
          fontFamily: 'Courier Prime, monospace'
        }}>
          📄 {conspiracy.total_documents} documents
        </div>
      </div>

      {/* Description/Premise */}
      <div style={{ 
        flex: 1,
        fontSize: '0.85rem',
        color: '#fff',
        lineHeight: '1.5',
        marginBottom: '1rem',
        fontFamily: 'Courier Prime, monospace'
      }}>
        {conspiracy.premise || 'A mysterious conspiracy waiting to be unraveled...'}
      </div>

      {/* Status-specific section */}
      <div style={{ marginTop: 'auto' }}>
        {conspiracy.status === 'upcoming' && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <Timer 
                startTime={conspiracy.created_at} 
                endTime={conspiracy.created_at}
                label="Starts in"
              />
            </div>
            <button
              onClick={() => onRegister(conspiracy.mystery_id)}
              disabled={isEffectivelyRegistered}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: isEffectivelyRegistered ? 'rgba(0, 255, 65, 0.1)' : 'rgba(90, 127, 163, 0.1)',
                border: isEffectivelyRegistered ? '1px solid #00ff41' : '1px solid #5a7fa3',
                color: isEffectivelyRegistered ? '#00ff41' : '#5a7fa3',
                cursor: isEffectivelyRegistered ? 'default' : 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'Courier Prime, monospace',
                transition: 'all 0.3s ease',
              }}
            >
              {isEffectivelyRegistered ? '✓ REGISTERED' : 'REGISTER'}
            </button>
          </>
        )}

        {conspiracy.status === 'active' && (
          <Link to={`/conspiracy/${conspiracy.mystery_id}/board`}>
            <button
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(0, 255, 65, 0.1)',
                border: '1px solid #00ff41',
                color: '#00ff41',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'Courier Prime, monospace',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 65, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 255, 65, 0.1)'
              }}
            >
              🔍 INVESTIGATE
            </button>
          </Link>
        )}

        {conspiracy.status === 'ended' && (
          <div style={{
            padding: '0.75rem',
            background: 'rgba(90, 127, 163, 0.1)',
            border: '1px solid #5a7fa3',
            color: '#5a7fa3',
            fontSize: '0.85rem',
            textAlign: 'center',
            fontFamily: 'Courier Prime, monospace'
          }}>
            ENDED
          </div>
        )}
      </div>
    </div>
  )
}

export default ConspiracyCard

