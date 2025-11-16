import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Conspiracy } from '../types'

// Types
export interface User {
  address: string
  registeredConspiracies: string[]
  // Legacy field for backward compatibility
  registeredMissions?: string[]
}

export interface DocumentNode {
  id: string
  type: 'document'
  position: { x: number; y: number }
  data: {
    title: string
    contentType: 'text' | 'image' | 'mixed'
    content: string
    images?: string[]
  }
}

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  currentConspiracy: Conspiracy | null
  setCurrentConspiracy: (conspiracy: Conspiracy | null) => void
  // Legacy for backward compatibility
  currentMission: Conspiracy | null
  setCurrentMission: (conspiracy: Conspiracy | null) => void
  nodes: DocumentNode[]
  setNodes: (nodes: DocumentNode[]) => void
  selectedDocument: DocumentNode | null
  setSelectedDocument: (doc: DocumentNode | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [currentConspiracy, setCurrentConspiracy] = useState<Conspiracy | null>(null)
  const [nodes, setNodes] = useState<DocumentNode[]>([])
  const [selectedDocument, setSelectedDocument] = useState<DocumentNode | null>(null)

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currentConspiracy,
        setCurrentConspiracy,
        // Legacy aliases
        currentMission: currentConspiracy,
        setCurrentMission: setCurrentConspiracy,
        nodes,
        setNodes,
        selectedDocument,
        setSelectedDocument,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
