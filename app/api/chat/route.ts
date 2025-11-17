import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { siteId, messages } = body || {}
  const userMsg = Array.isArray(messages) ? messages[messages.length - 1]?.content || '' : ''

  const reply = buildAssistantReply(userMsg)

  return NextResponse.json({ reply, siteId })
}

function buildAssistantReply(prompt: string): string {
  if (!prompt) return 'How can I help with EHS at your site today?'
  const lower = String(prompt).toLowerCase()
  if (lower.includes('incident')) {
    return 'Logged your note. Consider: severity, date, who/what involved, and corrective actions.'
  }
  if (lower.includes('audit')) {
    return 'Starting an audit checklist: PPE, equipment guards, grain bin lockout, chemical storage, tractor ROPS.'
  }
  if (lower.includes('plan')) {
    return 'Drafting a simple plan: goals (reduce slips/falls), actions (walkways, signage), due (30 days), status (draft).'
  }
  if (lower.includes('hazard')) {
    return 'List the hazard, assign risk (low/medium/high), and add controls. I can help summarize.'
  }
  return `Noted: "${prompt}". I can turn this into a plan, audit note, or incident. Say which.`
}
