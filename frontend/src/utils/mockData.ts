import { Mission, Document } from '../types'

// ==========================================
// DEPRECATED: Mock data for testing only
// All data now comes from Arkiv blockchain
// ==========================================

// Mock missions data
export const mockMissions: Mission[] = [
  {
    id: 'mission-1',
    title: 'The Hecatomb Conspiracy',
    description: 'Uncover the truth behind a mysterious series of events.',
    mainQuestion: 'Who orchestrated the financial collapse?',
    startTime: '2024-11-15T10:00:00Z',
    endTime: '2025-12-17T10:00:00Z',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',
  },
  {
    id: 'mission-2',
    title: 'Operation Shadow Network',
    description: 'Investigate a clandestine network of communications.',
    mainQuestion: 'What is the true purpose of the network?',
    startTime: '2025-11-20T14:00:00Z',
    endTime: '2025-11-22T14:00:00Z',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=320&h=180&fit=crop',
  },
  {
    id: 'mission-3',
    title: 'The Blackout Protocol',
    description: 'A sudden blackout revealed more than technical failures.',
    mainQuestion: 'What caused the blackout?',
    startTime: '2024-11-10T09:00:00Z',
    endTime: '2024-11-12T09:00:00Z',
    status: 'ended',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=320&h=180&fit=crop',
  },
]

// Mock documents for missions
export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Encrypted Email Thread',
    type: 'email',
    icon: '📧',
    state: 'unopened',
    content: {
      from: 'anonymous@darknet.onion',
      to: 'operative@secure.net',
      subject: 'RE: Project Hecatomb - Phase 2',
      emailDate: '2024-10-15',
      emailTime: '23:47',
      body: 'The transfer has been completed. All traces erased. Proceed with phase 2 as planned. The board meeting is scheduled for next week. Make sure the documents are ready.',
    },
  },
  {
    id: 'doc-2',
    name: 'Personal Diary Entry',
    type: 'diary',
    icon: '📔',
    state: 'unopened',
    content: {
      diaryDate: '2024-10-18',
      mood: 'Anxious',
      diaryEntry: "I can't shake the feeling that something is wrong. The numbers don't add up. Why would they transfer that much money to an offshore account? I need to investigate further, but I'm scared of what I might find.",
    },
  },
  {
    id: 'doc-3',
    name: 'Police Incident Report',
    type: 'police_report',
    icon: '🚔',
    state: 'unopened',
    content: {
      caseNumber: 'PD-2024-10892',
      reportDate: '2024-10-20',
      reportTime: '14:30',
      officer: 'Det. Sarah Mitchell',
      badge: '4729',
      incidentType: 'Suspicious Activity',
      location: 'Financial District, Downtown',
      reportSummary: 'Witness reported unusual activity at corporate headquarters. Multiple individuals seen entering building after hours with large briefcases. Security footage shows systematic deletion of digital records.',
    },
  },
  {
    id: 'doc-4',
    name: 'Employee ID Badge',
    type: 'badge',
    icon: '🪪',
    state: 'unopened',
    content: {
      badgeId: 'EMP-4729',
      employeeName: 'Dr. Marcus Chen',
      department: 'Research & Development',
      position: 'Senior Data Analyst',
      issueDate: '2023-01-15',
      expiryDate: '2025-01-15',
      accessLevel: 'LEVEL 5 - CLASSIFIED',
    },
  },
  {
    id: 'doc-5',
    name: 'Witness Statement',
    type: 'witness_statement',
    icon: '📝',
    state: 'unopened',
    content: {
      witnessName: 'Jennifer Rodriguez',
      witnessAddress: '[REDACTED]',
      statementDate: '2024-10-21',
      statementTime: '10:15',
      interviewedBy: 'Det. Sarah Mitchell',
      statementText: 'I was working late that night. I saw Dr. Chen leaving the secure server room at 2 AM. He looked nervous, kept looking over his shoulder. He was carrying a USB drive. When I asked him what he was doing, he told me to forget I saw him and quickly left.',
    },
  },
  {
    id: 'doc-6',
    name: 'Bank Statement - Offshore',
    type: 'bank_statement',
    icon: '🏦',
    state: 'unopened',
    content: {
      accountNumber: '****-****-4729',
      accountHolder: '[CONFIDENTIAL]',
      statementPeriod: 'October 2024',
      openingBalance: '$125,000',
      closingBalance: '$5,847,293',
      transactions: [
        { date: '10/15', description: 'Wire Transfer - Project H', amount: '+$2,500,000', balance: '$2,625,000' },
        { date: '10/16', description: 'Wire Transfer - Classified', amount: '+$1,800,000', balance: '$4,425,000' },
        { date: '10/18', description: 'Crypto Conversion', amount: '+$1,422,293', balance: '$5,847,293' },
      ],
    },
  },
  {
    id: 'doc-7',
    name: 'Internal Memo - URGENT',
    type: 'internal_memo',
    icon: '📄',
    state: 'unopened',
    content: {
      memoTo: 'Board of Directors',
      memoFrom: 'CEO - Richard Blackwell',
      memoDate: '2024-10-22',
      memoSubject: 'Project Hecatomb - Immediate Action Required',
      memoBody: 'The situation has escalated beyond our control. We need to activate the contingency plan immediately. All evidence must be secured or destroyed. The audit team cannot discover what we\'ve done. Schedule emergency meeting for tomorrow 6 AM.',
      priority: 'URGENT',
      confidential: true,
    },
  },
  {
    id: 'doc-8',
    name: 'Phone Call Records',
    type: 'phone_record',
    icon: '📞',
    state: 'unopened',
    content: {
      phoneNumber: '+1-555-0147',
      callDate: '2024-10-19',
      callRecords: [
        { time: '08:45', number: '+1-555-0892', duration: '12:34', type: 'Outgoing' },
        { time: '14:22', number: '[BLOCKED]', duration: '45:12', type: 'Incoming' },
        { time: '23:15', number: '+41-22-XXX-XXXX', duration: '28:03', type: 'Outgoing' },
      ],
    },
  },
  {
    id: 'doc-9',
    name: 'Hotel Receipt',
    type: 'receipt',
    icon: '🧾',
    state: 'unopened',
    content: {
      storeName: 'Grand Cayman Resort',
      storeAddress: 'Seven Mile Beach, Cayman Islands',
      receiptNumber: 'RCP-2024-10-4729',
      receiptDate: '2024-10-17',
      receiptTime: '16:30',
      items: [
        { name: 'Presidential Suite (3 nights)', quantity: '1', price: '$4,500.00' },
        { name: 'Conference Room Rental', quantity: '1', price: '$2,000.00' },
        { name: 'Secure Document Shredding', quantity: '1', price: '$500.00' },
      ],
      totalAmount: '$7,000.00',
      paymentMethod: 'Corporate Card ***4729',
    },
  },
  {
    id: 'doc-10',
    name: 'Surveillance Log',
    type: 'surveillance_log',
    icon: '📹',
    state: 'unopened',
    content: {
      surveillanceDate: '2024-10-20',
      surveillanceLocation: 'Corporate HQ - Basement Level',
      operator: 'Security Officer J. Williams',
      logEntries: [
        { time: '22:15', activity: 'Subject enters server room', notes: 'Unscheduled access' },
        { time: '22:47', activity: 'Multiple hard drives removed', notes: 'Carrying large bag' },
        { time: '23:03', activity: 'Subject exits building', notes: 'Avoided main cameras' },
      ],
    },
  },
  {
    id: 'doc-11',
    name: 'Newspaper Article',
    type: 'newspaper',
    icon: '📰',
    state: 'unopened',
    content: {
      newspaperName: 'The Financial Times',
      date: '2024-10-23',
      volume: 'Vol. 142',
      issue: 'No. 287',
      headline: 'MAJOR TECH FIRM UNDER INVESTIGATION',
      subheadline: 'FBI raids headquarters following anonymous tip',
      articleText: 'Federal agents executed search warrants at the headquarters of TechCorp Industries early this morning following allegations of financial fraud and data manipulation. The company\'s CEO, Richard Blackwell, declined to comment. Sources close to the investigation suggest the probe centers around Project Hecatomb, a classified initiative that may have violated federal regulations.',
    },
  },
  {
    id: 'doc-12',
    name: 'Medical Report',
    type: 'medical_record',
    icon: '🏥',
    state: 'unopened',
    content: {
      patientName: '[REDACTED - HIPAA]',
      medicalDate: '2024-10-19',
      doctorName: 'Dr. Elizabeth Hart',
      diagnosis: 'Patient presenting with severe anxiety and paranoia. Reports feeling watched and followed. Mentions workplace stress related to "discovering something terrible." Recommended immediate psychiatric evaluation.',
    },
  },
]

// Helper functions
export function getAllMissions(): Mission[] {
  return mockMissions
}

export function getMissionById(id: string): Mission | undefined {
  return mockMissions.find(m => m.id === id)
}

export function getDocumentsForMission(missionId: string): Document[] {
  // For now, return all documents for mission-1 and mission-4
  if (missionId === 'mission-1' || missionId === 'mission-4') {
    return mockDocuments
  }
  return []
}
