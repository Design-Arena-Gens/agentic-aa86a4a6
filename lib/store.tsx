"use client"
import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { EHSState, EHSSite, ChatMessage, CompliancePlan, Audit, Incident, Hazard, Crew, Equipment, Condition, ID } from '@/lib/types'
import { loadState, saveState } from '@/lib/storage'

// simple uuid fallback
function generateId(): ID {
  try {
    return uuidv4()
  } catch {
    return Math.random().toString(36).slice(2)
  }
}

export type AppAction =
  | { type: 'INIT'; payload: EHSState }
  | { type: 'ADD_SITE'; payload: Omit<EHSSite, 'id' | 'createdAt'> }
  | { type: 'UPDATE_SITE'; payload: EHSSite }
  | { type: 'DELETE_SITE'; payload: { id: ID } }
  | { type: 'ADD_MESSAGE'; payload: { siteId: ID; role: ChatMessage['role']; content: string } }
  | { type: 'ADD_PLAN'; payload: Omit<CompliancePlan, 'id' | 'createdAt'> }
  | { type: 'ADD_AUDIT'; payload: Omit<Audit, 'id' | 'createdAt'> }
  | { type: 'ADD_INCIDENT'; payload: Omit<Incident, 'id' | 'createdAt'> }
  | { type: 'ADD_HAZARD'; payload: Omit<Hazard, 'id' | 'createdAt'> }
  | { type: 'ADD_CREW'; payload: Omit<Crew, 'id' | 'createdAt'> }
  | { type: 'ADD_EQUIPMENT'; payload: Omit<Equipment, 'id' | 'createdAt'> }
  | { type: 'ADD_CONDITION'; payload: Omit<Condition, 'id' | 'createdAt'> }

function reducer(state: EHSState, action: AppAction): EHSState {
  switch (action.type) {
    case 'INIT':
      return action.payload
    case 'ADD_SITE': {
      const site: EHSSite = { id: generateId(), createdAt: new Date().toISOString(), ...action.payload }
      return { ...state, sites: [site, ...state.sites] }
    }
    case 'UPDATE_SITE': {
      return { ...state, sites: state.sites.map(s => (s.id === action.payload.id ? action.payload : s)) }
    }
    case 'DELETE_SITE': {
      const { id } = action.payload
      const { [id]: _, ...restMsgs } = state.messagesBySite
      return {
        ...state,
        sites: state.sites.filter(s => s.id !== id),
        messagesBySite: restMsgs,
        plans: state.plans.filter(x => x.siteId !== id),
        audits: state.audits.filter(x => x.siteId !== id),
        incidents: state.incidents.filter(x => x.siteId !== id),
        hazards: state.hazards.filter(x => x.siteId !== id),
        crews: state.crews.filter(x => x.siteId !== id),
        equipment: state.equipment.filter(x => x.siteId !== id),
        conditions: state.conditions.filter(x => x.siteId !== id),
      }
    }
    case 'ADD_MESSAGE': {
      const { siteId, role, content } = action.payload
      const msg: ChatMessage = { id: generateId(), role, content, createdAt: new Date().toISOString() }
      const msgs = state.messagesBySite[siteId] ?? []
      return { ...state, messagesBySite: { ...state.messagesBySite, [siteId]: [...msgs, msg] } }
    }
    case 'ADD_PLAN': {
      const plan: CompliancePlan = { id: generateId(), createdAt: new Date().toISOString(), ...action.payload }
      return { ...state, plans: [plan, ...state.plans] }
    }
    case 'ADD_AUDIT': {
      const item: Audit = { id: generateId(), createdAt: new Date().toISOString(), ...action.payload }
      return { ...state, audits: [item, ...state.audits] }
    }
    case 'ADD_INCIDENT': {
      const item: Incident = { id: generateId(), createdAt: new Date().toISOString(), ...action.payload }
      return { ...state, incidents: [item, ...state.incidents] }
    }
    case 'ADD_HAZARD': {
      const item: Hazard = { id: generateId(), createdAt: new Date().toISOString(), ...action.payload }
      return { ...state, hazards: [item, ...state.hazards] }
    }
    case 'ADD_CREW': {
      const item: Crew = { id: generateId(), createdAt: new Date().toISOString(), ...action.payload }
      return { ...state, crews: [item, ...state.crews] }
    }
    case 'ADD_EQUIPMENT': {
      const item: Equipment = { id: generateId(), createdAt: new Date().toISOString(), ...action.payload }
      return { ...state, equipment: [item, ...state.equipment] }
    }
    case 'ADD_CONDITION': {
      const item: Condition = { id: generateId(), createdAt: new Date().toISOString(), ...action.payload }
      return { ...state, conditions: [item, ...state.conditions] }
    }
    default:
      return state
  }
}

const initialState: EHSState = {
  sites: [],
  messagesBySite: {},
  plans: [],
  audits: [],
  incidents: [],
  hazards: [],
  crews: [],
  equipment: [],
  conditions: [],
}

const AppStoreContext = React.createContext<{
  state: EHSState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  React.useEffect(() => {
    const loaded = loadState()
    if (loaded) dispatch({ type: 'INIT', payload: loaded })
  }, [])

  React.useEffect(() => {
    saveState(state)
  }, [state])

  return <AppStoreContext.Provider value={{ state, dispatch }}>{children}</AppStoreContext.Provider>
}

export function useAppStore() {
  const ctx = React.useContext(AppStoreContext)
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider')
  return ctx
}
