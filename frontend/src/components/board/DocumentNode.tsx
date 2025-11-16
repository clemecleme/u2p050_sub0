import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { DocumentNode as DocumentNodeType } from '../../types'

const DocumentNode = memo(({ data, type }: NodeProps<DocumentNodeType['data']> & { type?: string }) => {
  const nodeType = type || 'terminal'
  const content = data.content || {}
  
  // Get type display name
  const getTypeName = (t: string) => {
    const names: Record<string, string> = {
      email: 'EMAIL',
      diary: 'DIARY ENTRY',
      police_report: 'POLICE REPORT',
      badge: 'ID BADGE',
      badge_log: 'BADGE LOG',
      witness_statement: 'WITNESS STATEMENT',
      bank_statement: 'BANK STATEMENT',
      newspaper: 'NEWSPAPER',
      internal_memo: 'INTERNAL MEMO',
      phone_record: 'PHONE RECORD',
      receipt: 'RECEIPT',
      surveillance_log: 'SURVEILLANCE LOG',
      medical_record: 'MEDICAL RECORD',
      article: 'ARTICLE',
      terminal: 'TERMINAL',
      image: 'IMAGE',
      // New Arkiv types
      login_history: 'LOGIN HISTORY',
      server_log: 'SERVER LOG',
      firewall_log: 'FIREWALL LOG',
      network_log: 'NETWORK LOG',
      access_control: 'ACCESS CONTROL',
      vpn_log: 'VPN LOG',
      door_access_log: 'DOOR ACCESS LOG',
      it_inventory: 'IT INVENTORY',
      security_scan: 'SECURITY SCAN',
      device_registry: 'DEVICE REGISTRY',
      asset_database: 'ASSET DATABASE',
    }
    return names[t] || t.toUpperCase().replace(/_/g, ' ')
  }
  
  // Render content based on type - UNIFIED TERMINAL STYLE
  const renderContent = () => {
    switch (nodeType) {
      case 'email':
        const bodyPreview = (content.body || 'No content').substring(0, 100) + '...'
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">FROM:</span> {content.from || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">TO:</span> {Array.isArray(content.to) ? content.to.slice(0, 2).join(', ') : content.to || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">SUBJ:</span> {(content.subject || 'No Subject').substring(0, 40)}</div>
            <div className="terminal-separator">---</div>
            <div className="terminal-line-small">{bodyPreview}</div>
          </div>
        )
      
      case 'diary':
        const diaryPreview = (content.content || content.entry_text || content.diaryEntry || 'No entry').substring(0, 120) + '...'
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.date || content.diaryDate || 'Unknown'}</div>
            {content.author && <div className="terminal-line"><span className="terminal-label">AUTHOR:</span> {content.author}</div>}
            {content.mood && <div className="terminal-line"><span className="terminal-label">MOOD:</span> {content.mood}</div>}
            <div className="terminal-separator">---</div>
            <div className="terminal-line-small" style={{ fontStyle: 'italic' }}>{diaryPreview}</div>
          </div>
        )
      
      case 'police_report':
        const reportPreview = (content.report || content.incident_description || content.reportSummary || 'No report').substring(0, 100) + '...'
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">CASE:</span> {content.case_number || content.caseNumber || 'N/A'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.report_date || content.reportDate || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">OFFICER:</span> {content.officer || content.officer_name || 'Unknown'}</div>
            <div className="terminal-separator">---</div>
            <div className="terminal-line-small">{reportPreview}</div>
            {content.witnesses && content.witnesses.length > 0 && (
              <div className="terminal-line-small">└─ {content.witnesses.length} witness(es)</div>
            )}
          </div>
        )
      
      case 'badge':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">BADGE ID:</span> {content.badgeId || 'N/A'}</div>
            <div className="terminal-line"><span className="terminal-label">NAME:</span> {content.employeeName || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DEPT:</span> {content.department || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">POSITION:</span> {content.position || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">ACCESS LEVEL:</span> {content.accessLevel || 'N/A'}</div>
          </div>
        )
      
      case 'witness_statement':
        const statementPreview = (content.statement || content.statement_text || content.statementText || 'No statement').substring(0, 100) + '...'
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">WITNESS:</span> {content.witness_name || content.witnessName || 'Anonymous'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.statement_date || content.statementDate || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">OFFICER:</span> {content.interviewer || content.interviewedBy || 'Unknown'}</div>
            <div className="terminal-separator">---</div>
            <div className="terminal-line-small">{statementPreview}</div>
          </div>
        )
      
      case 'bank_statement':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">ACC:</span> {content.account_number || content.accountNumber || 'N/A'}</div>
            <div className="terminal-line"><span className="terminal-label">HOLDER:</span> {(content.account_holder || content.accountHolder || 'Unknown').substring(0, 20)}</div>
            <div className="terminal-line"><span className="terminal-label">BAL:</span> ${content.closing_balance || content.closingBalance || '0'}</div>
            {content.transactions && content.transactions.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                  DATE     | AMOUNT    | BAL
                </div>
                {content.transactions.slice(0, 3).map((t: any, i: number) => (
                  <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                    {(t.date || '??').padEnd(8)} | {String(t.amount).padEnd(9)} | {String(t.balance).padEnd(8)}
                  </div>
                ))}
              </>
            )}
          </div>
        )
      
      case 'newspaper':
        const articlePreview = (content.articleText || content.mainArticle || 'No article text').substring(0, 120) + '...'
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">PUB:</span> {(content.newspaperName || 'Unknown').substring(0, 25)}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.date || 'Unknown'}</div>
            <div className="terminal-separator">---</div>
            <div className="terminal-line" style={{ fontWeight: 'bold' }}>{(content.headline || data.title || 'No Headline').substring(0, 45)}</div>
            <div className="terminal-line-small" style={{ marginTop: '4px' }}>{articlePreview}</div>
          </div>
        )
      
      case 'internal_memo':
        const memoPreview = (content.content || content.memoBody || 'No content').substring(0, 100) + '...'
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">FROM:</span> {content.from || content.memoFrom || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">TO:</span> {Array.isArray(content.to) ? content.to[0] : content.to || content.memoTo || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">SUBJ:</span> {(content.subject || content.memoSubject || 'No Subject').substring(0, 35)}</div>
            {(content.classification || content.confidential) && <div className="terminal-alert">[{content.classification || 'CONFIDENTIAL'}]</div>}
            <div className="terminal-separator">---</div>
            <div className="terminal-line-small">{memoPreview}</div>
          </div>
        )
      
      case 'phone_record':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">NUMBER:</span> {content.phoneNumber || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">CALLS:</span> {content.callRecords?.length || 0}</div>
            {content.callRecords && content.callRecords.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                  TIME  | NUMBER      | DUR | TYPE
                </div>
                {content.callRecords.slice(0, 3).map((call: any, i: number) => {
                  const time = (call.time || '??:??').substring(0, 5).padEnd(5)
                  const number = (call.number || '?').substring(0, 11).padEnd(11)
                  const duration = String(call.duration || '?').padEnd(3)
                  const type = call.type || '?'
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {time} | {number} | {duration} | {type}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'receipt':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">STORE:</span> {(content.storeName || content.merchant || 'Unknown').substring(0, 25)}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.receiptDate || content.date || 'Unknown'}</div>
            {content.items && content.items.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                  ITEM            | QTY | PRICE
                </div>
                {content.items.slice(0, 3).map((item: any, i: number) => {
                  const name = (item.name || '?').substring(0, 15).padEnd(15)
                  const qty = String(item.quantity || 1).padEnd(3)
                  const price = item.price || '?'
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                      {name} | {qty} | {price}
                    </div>
                  )
                })}
                <div className="terminal-separator">---</div>
                <div className="terminal-line"><span className="terminal-label">TOTAL:</span> {content.totalAmount || 'N/A'}</div>
              </>
            )}
          </div>
        )
      
      case 'surveillance_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">LOC:</span> {content.location || content.surveillanceLocation || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">OBS:</span> {content.observations?.length || content.logEntries?.length || 0}</div>
            {(content.observations || content.logEntries) && (content.observations || content.logEntries).length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                  TIME  | SUBJECT    | ACTIVITY
                </div>
                {(content.observations || content.logEntries).slice(0, 3).map((entry: any, i: number) => {
                  const time = entry.time || entry.timestamp ? (entry.time || entry.timestamp).substring(11, 16) : '??:??'
                  const subject = (entry.subject || '?').substring(0, 10).padEnd(10)
                  const activity = (entry.activity || '?').substring(0, 30)
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {time} | {subject} | {activity}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'medical_record':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">PATIENT:</span> {content.patientName || 'REDACTED'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.medicalDate || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DOCTOR:</span> {content.doctorName || 'Unknown'}</div>
            <div className="terminal-separator">---</div>
            <div className="terminal-body">{content.diagnosis || content.notes || 'No information'}</div>
          </div>
        )
      
      case 'article':
        const textPreview = (content.previewText || content.articleText || content.content || 'No content').substring(0, 120) + '...'
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">SOURCE:</span> {(content.source || 'Unknown').substring(0, 25)}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.date || 'Unknown'}</div>
            <div className="terminal-separator">---</div>
            <div className="terminal-line" style={{ fontWeight: 'bold' }}>{(content.heading || data.title || 'No Title').substring(0, 45)}</div>
            <div className="terminal-line-small" style={{ marginTop: '4px' }}>{textPreview}</div>
          </div>
        )
      
      case 'image':
        return (
          <div className="terminal-doc-content">
            {content.imageUrl && (
              <img src={content.imageUrl} alt={content.caption || data.title} className="terminal-image" />
            )}
            {content.caption && <div className="terminal-caption">{content.caption}</div>}
          </div>
        )
      
      // === NEW ARKIV DOCUMENT TYPES ===
      
      case 'badge_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">FACILITY:</span> {content.facility || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DATE:</span> {content.log_date || 'Unknown'}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                  TIME  | USER        | LOC      | STATUS
                </div>
                {content.entries.slice(0, 3).map((entry: any, i: number) => {
                  const time = entry.timestamp ? entry.timestamp.substring(11, 16) : '??:??'
                  const user = (entry.user || entry.name || '?').substring(0, 11).padEnd(11)
                  const loc = (entry.location || '?').substring(0, 8).padEnd(8)
                  const status = entry.status || '?'
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {time} | {user} | {loc} | {status}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'login_history':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">SYSTEM:</span> {content.system || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">EVENTS:</span> {content.authentication_events?.length || 0}</div>
            {content.authentication_events && content.authentication_events.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                  TIME  | USER      | EVENT       | STATUS
                </div>
                {content.authentication_events.slice(0, 3).map((event: any, i: number) => {
                  const time = event.timestamp ? event.timestamp.substring(11, 16) : '??:??'
                  const user = (event.username || '?').substring(0, 9).padEnd(9)
                  const evt = (event.event || '?').substring(0, 11).padEnd(11)
                  const status = event.status || '?'
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {time} | {user} | {evt} | {status}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'server_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">SERVER:</span> {content.server_name || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">LEVEL:</span> {content.log_level || 'INFO'}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                  TIME  | LVL  | SERVICE    | MESSAGE
                </div>
                {content.entries.slice(0, 3).map((entry: any, i: number) => {
                  const time = entry.timestamp ? entry.timestamp.substring(11, 16) : '??:??'
                  const level = (entry.level || '?').substring(0, 4).padEnd(4)
                  const service = (entry.service || '?').substring(0, 10).padEnd(10)
                  const msg = (entry.message || '?').substring(0, 25)
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {time} | {level} | {service} | {msg}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'firewall_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">FIREWALL:</span> {content.firewall_id || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">EVENTS:</span> {content.entries?.length || 0}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.62rem' }}>
                  SRC IP      :PORT | DST IP      :PORT | ACT
                </div>
                {content.entries.slice(0, 3).map((entry: any, i: number) => {
                  const srcIp = (entry.source_ip || '?.?.?.?').substring(0, 11).padEnd(11)
                  const srcPort = String(entry.source_port || '?').padEnd(5)
                  const dstIp = (entry.dest_ip || '?.?.?.?').substring(0, 11).padEnd(11)
                  const dstPort = String(entry.dest_port || '?').padEnd(5)
                  const action = (entry.action || '?').substring(0, 5)
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.62rem' }}>
                      {srcIp}:{srcPort} | {dstIp}:{dstPort} | {action}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'network_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">SEGMENT:</span> {content.network_segment || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">CONN:</span> {content.entries?.length || 0}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                  SRC      → DST      | PROTO | STATUS
                </div>
                {content.entries.slice(0, 3).map((entry: any, i: number) => {
                  const src = (entry.source || '?').substring(0, 8).padEnd(8)
                  const dst = (entry.destination || '?').substring(0, 8).padEnd(8)
                  const proto = (entry.protocol || '?').substring(0, 5).padEnd(5)
                  const status = (entry.status || '?').substring(0, 10)
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {src} → {dst} | {proto} | {status}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'access_control':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">FACILITY:</span> {content.facility || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">EVENTS:</span> {content.entries?.length || 0}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                  TIME  | USER      | ZONE  | RESULT
                </div>
                {content.entries.slice(0, 3).map((entry: any, i: number) => {
                  const time = entry.timestamp ? entry.timestamp.substring(11, 16) : '??:??'
                  const user = (entry.user || '?').substring(0, 9).padEnd(9)
                  const zone = (entry.zone || '?').substring(0, 5).padEnd(5)
                  const result = entry.result || '?'
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {time} | {user} | {zone} | {result}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'vpn_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">GATEWAY:</span> {content.vpn_gateway || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">EVENTS:</span> {content.entries?.length || 0}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                  TIME  | USER    | EVENT      | PROTO
                </div>
                {content.entries.slice(0, 3).map((entry: any, i: number) => {
                  const time = entry.timestamp ? entry.timestamp.substring(11, 16) : '??:??'
                  const user = (entry.user_id || '?').substring(0, 7).padEnd(7)
                  const event = (entry.event || '?').substring(0, 10).padEnd(10)
                  const proto = (entry.protocol || '?').substring(0, 8)
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {time} | {user} | {event} | {proto}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'door_access_log':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">FACILITY:</span> {content.facility || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">EVENTS:</span> {content.entries?.length || 0}</div>
            {content.entries && content.entries.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                  TIME  | DOOR | USER        | ACTION
                </div>
                {content.entries.slice(0, 3).map((entry: any, i: number) => {
                  const time = entry.timestamp ? entry.timestamp.substring(11, 16) : '??:??'
                  const door = (entry.door_id || '?').substring(0, 4).padEnd(4)
                  const user = (entry.user || '?').substring(0, 11).padEnd(11)
                  const action = entry.action || '?'
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {time} | {door} | {user} | {action}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'it_inventory':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">DEPT:</span> {content.department || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">ITEMS:</span> {content.items?.length || 0}</div>
            {content.items && content.items.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                  ASSET  | TYPE      | ASSIGNED    | STATUS
                </div>
                {content.items.slice(0, 3).map((item: any, i: number) => {
                  const asset = (item.asset_id || '?').substring(0, 6).padEnd(6)
                  const type = (item.device_type || '?').substring(0, 9).padEnd(9)
                  const assigned = (item.assigned_to || '?').substring(0, 11).padEnd(11)
                  const status = item.status || '?'
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {asset} | {type} | {assigned} | {status}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'security_scan':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">SCAN:</span> {content.scan_type || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">FINDINGS:</span> {content.results?.length || 0}</div>
            {content.results && content.results.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                  SEV  | TARGET      | FINDING
                </div>
                {content.results.slice(0, 3).map((result: any, i: number) => {
                  const sev = (result.severity || '?').substring(0, 4).padEnd(4)
                  const target = (result.target || '?').substring(0, 11).padEnd(11)
                  const finding = (result.finding || '?').substring(0, 25)
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {sev} | {target} | {finding}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'device_registry':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">REGISTRY:</span> {content.registry_date || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">DEVICES:</span> {content.devices?.length || 0}</div>
            {content.devices && content.devices.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                  ID    | NAME         | IP ADDR      | STATUS
                </div>
                {content.devices.slice(0, 3).map((device: any, i: number) => {
                  const id = (device.device_id || '?').substring(0, 5).padEnd(5)
                  const name = (device.device_name || '?').substring(0, 12).padEnd(12)
                  const ip = (device.ip_address || '?.?.?.?').substring(0, 12).padEnd(12)
                  const status = device.status || '?'
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {id} | {name} | {ip} | {status}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      case 'asset_database':
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line"><span className="terminal-label">DATABASE:</span> {content.database || 'Unknown'}</div>
            <div className="terminal-line"><span className="terminal-label">RECORDS:</span> {content.records?.length || 0}</div>
            {content.records && content.records.length > 0 && (
              <>
                <div className="terminal-separator">---</div>
                <div className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                  ASSET | TYPE      | OWNER       | STATUS
                </div>
                {content.records.slice(0, 3).map((record: any, i: number) => {
                  const asset = (record.asset_id || '?').substring(0, 5).padEnd(5)
                  const type = (record.asset_type || '?').substring(0, 9).padEnd(9)
                  const owner = (record.owner || '?').substring(0, 11).padEnd(11)
                  const status = record.status || '?'
                  return (
                    <div key={i} className="terminal-line-small" style={{ fontFamily: 'monospace', fontSize: '0.65rem' }}>
                      {asset} | {type} | {owner} | {status}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )
      
      default:
        return (
          <div className="terminal-doc-content">
            <div className="terminal-line">
              <span className="terminal-prompt">$</span>
              <span className="terminal-text">{content.terminalText || data.title}</span>
              <span className="terminal-cursor">_</span>
            </div>
          </div>
        )
    }
  }
  
  return (
    <div className="landing-window board-node-window">
      {/* Connection Handle - Top Center - MUST STAY ABOVE EVERYTHING */}
      <Handle 
        type="source" 
        position={Position.Top} 
        className="connection-handle connection-handle-center"
      />
      
      {/* Header */}
      <div className="node-header">
        <button className="node-close-button" onClick={(e) => {
          e.stopPropagation()
        }}>×</button>
        <div className="node-title">{getTypeName(nodeType)}</div>
      </div>
      
      {/* Content */}
      <div className="node-content">
        {renderContent()}
      </div>
    </div>
  )
})

DocumentNode.displayName = 'DocumentNode'

export default DocumentNode
