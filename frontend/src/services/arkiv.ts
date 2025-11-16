import { createPublicClient, http } from '@arkiv-network/sdk'
import { mendoza } from '@arkiv-network/sdk/chains'
import { eq } from '@arkiv-network/sdk/query'

// Initialize Arkiv public client (read-only, no wallet needed)
const arkiv = createPublicClient({
  chain: mendoza,
  transport: http(),
})

// Types for Arkiv responses
export interface ArkivEntity {
  entityKey: string
  owner: string
  payload: any
  attributes: Record<string, string>
}

export interface ConspiracyMetadata {
  mystery_id: string
  conspiracy_name: string
  world: string
  difficulty: number
  conspiracy_type: string
  total_documents: number
  premise: string
  created_at: string
  environment?: string
  status?: string
}

export interface ConspiracyDocument {
  document_id: string
  document_type: string
  fields: Record<string, any>
}

export interface ConspiracyImage {
  image_id: string
  imageData: Uint8Array
  entityKey: string
}

/**
 * Get all conspiracies from Arkiv
 * Queries for all entities with resource_type = "conspiracy"
 */
export async function getAllConspiracies(): Promise<ConspiracyMetadata[]> {
  try {
    const query = arkiv.buildQuery()
    const response = await query
      .where(eq('resource_type', 'conspiracy'))
      .withPayload(true)
      .withAttributes(true)
      .fetch()
    
    // Debug: Log the response structure
    console.log('Arkiv response:', response)
    console.log('Response type:', typeof response)
    console.log('Is array?', Array.isArray(response))
    
    // Handle different response structures
    let entities: any[]
    if (Array.isArray(response)) {
      entities = response
    } else if (response && typeof response === 'object') {
      // Try common response structures
      entities = (response as any).data || 
                (response as any).entities || 
                (response as any).results || 
                []
      console.log('Extracted entities from object:', entities)
    } else {
      console.error('Unexpected response structure:', response)
      entities = []
    }
    
    if (!Array.isArray(entities)) {
      console.error('Entities is not an array:', entities)
      return []
    }
    
    if (entities.length === 0) {
      console.log('No conspiracies found on Arkiv')
      return []
    }
    
    console.log('First entity sample:', entities[0])
    console.log('First entity payload type:', typeof entities[0].payload)
    console.log('First entity payload:', entities[0].payload)
    
    // Parse payloads and return metadata
    const conspiracies = entities.map((entity: ArkivEntity) => {
      // Handle different payload formats
      let data: any
      
      if (typeof entity.payload === 'string') {
        // Payload is a JSON string
        data = JSON.parse(entity.payload)
      } else if (entity.payload instanceof Uint8Array) {
        // Payload is binary data - decode as UTF-8 text first
        const decoder = new TextDecoder('utf-8')
        const jsonString = decoder.decode(entity.payload)
        data = JSON.parse(jsonString)
      } else if (typeof entity.payload === 'object' && entity.payload !== null) {
        // Payload is already a parsed object
        data = entity.payload
      } else {
        console.error('Unexpected payload type:', typeof entity.payload, entity.payload)
        throw new Error('Unexpected payload format')
      }
      
      return {
        mystery_id: data.mystery_id,
        conspiracy_name: data.conspiracy_name,
        world: data.world,
        difficulty: data.difficulty,
        conspiracy_type: data.conspiracy_type,
        total_documents: data.total_documents,
        premise: data.premise,
        created_at: data.created_at,
        environment: data.environment,
        status: data.status || 'active',
      }
    })
    
    // Sort by created_at descending (newest first)
    return conspiracies.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  } catch (error) {
    console.error('Error fetching conspiracies from Arkiv:', error)
    throw error
  }
}

/**
 * Get a single conspiracy by mystery_id
 */
export async function getConspiracyById(mysteryId: string): Promise<ConspiracyMetadata | null> {
  try {
    const query = arkiv.buildQuery()
    const response = await query
      .where(eq('mystery_id', mysteryId))
      .where(eq('resource_type', 'conspiracy'))
      .withPayload(true)
      .withAttributes(true)
      .fetch()
    
    // Handle different response structures
    let entities: any[] = Array.isArray(response) ? response : 
                         (response as any)?.data || 
                         (response as any)?.entities || 
                         []
    
    if (entities.length === 0) {
      return null
    }
    
    // Handle different payload formats
    let data: any
    const payload = entities[0].payload
    
    if (typeof payload === 'string') {
      data = JSON.parse(payload)
    } else if (payload instanceof Uint8Array) {
      const decoder = new TextDecoder('utf-8')
      const jsonString = decoder.decode(payload)
      data = JSON.parse(jsonString)
    } else if (typeof payload === 'object' && payload !== null) {
      data = payload
    } else {
      throw new Error('Unexpected payload format')
    }
    return {
      mystery_id: data.mystery_id,
      conspiracy_name: data.conspiracy_name,
      world: data.world,
      difficulty: data.difficulty,
      conspiracy_type: data.conspiracy_type,
      total_documents: data.total_documents,
      premise: data.premise,
      created_at: data.created_at,
      environment: data.environment,
      status: data.status || 'active',
    }
  } catch (error) {
    console.error('Error fetching conspiracy from Arkiv:', error)
    throw error
  }
}

/**
 * Get all documents for a conspiracy
 */
export async function getConspiracyDocuments(mysteryId: string): Promise<ConspiracyDocument[]> {
  try {
    const query = arkiv.buildQuery()
    const response = await query
      .where(eq('mystery_id', mysteryId))
      .where(eq('resource_type', 'document'))
      .withPayload(true)
      .withAttributes(true)
      .fetch()
    
    // Handle different response structures
    let entities: any[] = Array.isArray(response) ? response : 
                         (response as any)?.data || 
                         (response as any)?.entities || 
                         []
    
    // Parse document payloads
    const documents = entities.map((entity: ArkivEntity) => {
      let doc: any
      const payload = entity.payload
      
      if (typeof payload === 'string') {
        doc = JSON.parse(payload)
      } else if (payload instanceof Uint8Array) {
        const decoder = new TextDecoder('utf-8')
        const jsonString = decoder.decode(payload)
        doc = JSON.parse(jsonString)
      } else if (typeof payload === 'object' && payload !== null) {
        doc = payload
      } else {
        throw new Error('Unexpected payload format')
      }
      
      return {
        document_id: doc.document_id,
        document_type: doc.document_type,
        fields: doc.fields,
      }
    })
    
    return documents
  } catch (error) {
    console.error('Error fetching documents from Arkiv:', error)
    throw error
  }
}

/**
 * Get all images for a conspiracy
 */
export async function getConspiracyImages(mysteryId: string): Promise<ConspiracyImage[]> {
  try {
    const query = arkiv.buildQuery()
    const response = await query
      .where(eq('mystery_id', mysteryId))
      .where(eq('resource_type', 'image'))
      .withPayload(true)
      .withAttributes(true)
      .fetch()
    
    // Handle different response structures
    let entities: any[] = Array.isArray(response) ? response : 
                         (response as any)?.data || 
                         (response as any)?.entities || 
                         []
    
    // Extract image data (payload is raw bytes)
    const images = entities.map((entity: ArkivEntity) => ({
      image_id: entity.attributes.document_id || 'unknown',
      imageData: entity.payload as Uint8Array,
      entityKey: entity.entityKey,
    }))
    
    return images
  } catch (error) {
    console.error('Error fetching images from Arkiv:', error)
    throw error
  }
}

/**
 * Get all entities (metadata, documents, and images) for a conspiracy
 */
export async function getFullConspiracy(mysteryId: string) {
  try {
    const [metadata, documents, images] = await Promise.all([
      getConspiracyById(mysteryId),
      getConspiracyDocuments(mysteryId),
      getConspiracyImages(mysteryId),
    ])
    
    return {
      metadata,
      documents,
      images,
    }
  } catch (error) {
    console.error('Error fetching full conspiracy from Arkiv:', error)
    throw error
  }
}

// Export the client for direct access if needed
export { arkiv }

