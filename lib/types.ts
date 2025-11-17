export type ID = string

export type EHSSite = {
  id: ID
  name: string
  county: string
  description?: string
  createdAt: string
}

export type ChatMessage = {
  id: ID
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
}

export type CompliancePlan = {
  id: ID
  siteId: ID
  title: string
  goals: string
  actions: string
  dueDate?: string
  status: 'draft' | 'active' | 'done'
  createdAt: string
}

export type Audit = {
  id: ID
  siteId: ID
  title: string
  findings: string
  date: string
  status: 'open' | 'closed'
  createdAt: string
}

export type Incident = {
  id: ID
  siteId: ID
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  date: string
  involved: string
  correctiveActions?: string
  createdAt: string
}

export type Hazard = {
  id: ID
  siteId: ID
  name: string
  risk: 'low' | 'medium' | 'high'
  controls: string
  createdAt: string
}

export type Crew = {
  id: ID
  siteId: ID
  name: string
  members: string
  createdAt: string
}

export type Equipment = {
  id: ID
  siteId: ID
  name: string
  status: 'ok' | 'maintenance' | 'out-of-service'
  notes?: string
  createdAt: string
}

export type Condition = {
  id: ID
  siteId: ID
  type: 'weather' | 'field' | 'bio' | 'other'
  note: string
  createdAt: string
}

export type EHSState = {
  sites: EHSSite[]
  messagesBySite: Record<ID, ChatMessage[]>
  plans: CompliancePlan[]
  audits: Audit[]
  incidents: Incident[]
  hazards: Hazard[]
  crews: Crew[]
  equipment: Equipment[]
  conditions: Condition[]
}
