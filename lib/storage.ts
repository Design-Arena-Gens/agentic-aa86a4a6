import { EHSState } from '@/lib/types'

const STORAGE_KEY = 'iowa-ehs-state-v1'

export function loadState(): EHSState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as EHSState
  } catch {
    return null
  }
}

export function saveState(state: EHSState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}
