"use client"
import { useParams, useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChatPanel } from '@/components/chat-panel'
import React from 'react'

function SectionTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const sections = ['Chat', 'Plans', 'Audits', 'Incidents', 'Hazards', 'Crews', 'Equipment', 'Conditions', 'Analytics']
  return (
    <div className="flex flex-wrap items-center gap-2">
      {sections.map(s => (
        <Button key={s} variant={value === s ? 'default' : 'outline'} size="sm" onClick={() => onChange(s)}>
          {s}
        </Button>
      ))}
    </div>
  )
}

export default function SitePage() {
  const params = useParams<{ siteId: string }>()
  const router = useRouter()
  const { state, dispatch } = useAppStore()
  const site = state.sites.find(s => s.id === params.siteId)
  const [tab, setTab] = React.useState('Chat')

  React.useEffect(() => {
    if (!site) router.push('/dashboard')
  }, [site, router])

  if (!site) return null

  return (
    <div className="container-page py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{site.name}</h2>
          <p className="text-sm text-muted-foreground">{site.county}</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/dashboard')}>Back to sites</Button>
      </div>

      <SectionTabs value={tab} onChange={setTab} />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {tab === 'Chat' && <ChatPanel siteId={site.id} />}
          {tab === 'Plans' && <Plans siteId={site.id} />}
          {tab === 'Audits' && <Audits siteId={site.id} />}
          {tab === 'Incidents' && <Incidents siteId={site.id} />}
          {tab === 'Hazards' && <Hazards siteId={site.id} />}
          {tab === 'Crews' && <Crews siteId={site.id} />}
          {tab === 'Equipment' && <EquipmentList siteId={site.id} />}
          {tab === 'Conditions' && <Conditions siteId={site.id} />}
          {tab === 'Analytics' && <Analytics siteId={site.id} />}
        </div>
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assistant prompts</CardTitle>
              <CardDescription>One-tap starters tailored to farms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Draft a PTO safety plan', 'Log grain bin audit', 'Record minor injury', 'Identify top 3 hazards'].map(p => (
                <Button key={p} variant="secondary" className="w-full" onClick={() => {
                  const content = p
                  // simple pipeline: add user message then assistant drafts via API
                  window.dispatchEvent(new CustomEvent('assistant:quick', { detail: { siteId: site.id, content } }))
                }}>{p}</Button>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Site notes</CardTitle>
              <CardDescription>Short, practical notes.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{site.description || '?'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Plans({ siteId }: { siteId: string }) {
  const { state, dispatch } = useAppStore()
  const [title, setTitle] = React.useState('')
  const [goals, setGoals] = React.useState('')
  const [actions, setActions] = React.useState('')
  function add() {
    if (!title.trim()) return
    dispatch({ type: 'ADD_PLAN', payload: { siteId, title, goals, actions, status: 'draft' } })
    setTitle(''); setGoals(''); setActions('')
  }
  const items = state.plans.filter(p => p.siteId === siteId)
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>New plan</CardTitle>
          <CardDescription>Clear, short goals and actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="Goals" value={goals} onChange={e => setGoals(e.target.value)} />
          <Textarea placeholder="Actions" value={actions} onChange={e => setActions(e.target.value)} />
          <Button onClick={add}>Add plan</Button>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {items.map(p => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription className="whitespace-pre-wrap">{p.goals}</CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap">{p.actions}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Audits({ siteId }: { siteId: string }) {
  const { state, dispatch } = useAppStore()
  const [title, setTitle] = React.useState('')
  const [findings, setFindings] = React.useState('')
  function add() {
    if (!title.trim()) return
    dispatch({ type: 'ADD_AUDIT', payload: { siteId, title, findings, status: 'open', date: new Date().toISOString().slice(0,10) } })
    setTitle(''); setFindings('')
  }
  const items = state.audits.filter(p => p.siteId === siteId)
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>New audit</CardTitle>
          <CardDescription>Walkaround or deep dive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="Findings" value={findings} onChange={e => setFindings(e.target.value)} />
          <Button onClick={add}>Add audit</Button>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {items.map(p => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.date} ? {p.status}</CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap">{p.findings}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Incidents({ siteId }: { siteId: string }) {
  const { state, dispatch } = useAppStore()
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [severity, setSeverity] = React.useState<'low' | 'medium' | 'high'>('low')
  const [involved, setInvolved] = React.useState('')
  function add() {
    if (!title.trim()) return
    dispatch({ type: 'ADD_INCIDENT', payload: { siteId, title, description, severity, involved, date: new Date().toISOString().slice(0,10) } })
    setTitle(''); setDescription(''); setSeverity('low'); setInvolved('')
  }
  const items = state.incidents.filter(p => p.siteId === siteId)
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Record incident</CardTitle>
          <CardDescription>Keep details factual and short.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <div className="flex gap-2">
            {(['low','medium','high'] as const).map(s => (
              <Button key={s} type="button" variant={severity===s? 'default':'outline'} size="sm" onClick={() => setSeverity(s)}>{s}</Button>
            ))}
          </div>
          <Input placeholder="People / equipment involved" value={involved} onChange={e => setInvolved(e.target.value)} />
          <Button onClick={add}>Save incident</Button>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {items.map(p => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.date} ? {p.severity}</CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap">{p.description}\n\nInvolved: {p.involved}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Hazards({ siteId }: { siteId: string }) {
  const { state, dispatch } = useAppStore()
  const [name, setName] = React.useState('')
  const [risk, setRisk] = React.useState<'low'|'medium'|'high'>('medium')
  const [controls, setControls] = React.useState('')
  function add() {
    if (!name.trim()) return
    dispatch({ type: 'ADD_HAZARD', payload: { siteId, name, risk, controls } })
    setName(''); setRisk('medium'); setControls('')
  }
  const items = state.hazards.filter(p => p.siteId === siteId)
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>New hazard</CardTitle>
          <CardDescription>List control measures.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Hazard" value={name} onChange={e => setName(e.target.value)} />
          <div className="flex gap-2">
            {(['low','medium','high'] as const).map(s => (
              <Button key={s} type="button" variant={risk===s? 'default':'outline'} size="sm" onClick={() => setRisk(s)}>{s}</Button>
            ))}
          </div>
          <Textarea placeholder="Controls" value={controls} onChange={e => setControls(e.target.value)} />
          <Button onClick={add}>Add hazard</Button>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {items.map(p => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <CardDescription>Risk: {p.risk}</CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap">{p.controls}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Crews({ siteId }: { siteId: string }) {
  const { state, dispatch } = useAppStore()
  const [name, setName] = React.useState('')
  const [members, setMembers] = React.useState('')
  function add() {
    if (!name.trim()) return
    dispatch({ type: 'ADD_CREW', payload: { siteId, name, members } })
    setName(''); setMembers('')
  }
  const items = state.crews.filter(p => p.siteId === siteId)
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>New crew</CardTitle>
          <CardDescription>Comma-separated members.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Members" value={members} onChange={e => setMembers(e.target.value)} />
          <Button onClick={add}>Add crew</Button>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {items.map(p => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <CardDescription>{p.members}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

function EquipmentList({ siteId }: { siteId: string }) {
  const { state, dispatch } = useAppStore()
  const [name, setName] = React.useState('')
  const [status, setStatus] = React.useState<'ok'|'maintenance'|'out-of-service'>('ok')
  const [notes, setNotes] = React.useState('')
  function add() {
    if (!name.trim()) return
    dispatch({ type: 'ADD_EQUIPMENT', payload: { siteId, name, status, notes } })
    setName(''); setStatus('ok'); setNotes('')
  }
  const items = state.equipment.filter(p => p.siteId === siteId)
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add equipment</CardTitle>
          <CardDescription>Status and notes help plan maintenance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <div className="flex gap-2">
            {(['ok','maintenance','out-of-service'] as const).map(s => (
              <Button key={s} type="button" variant={status===s? 'default':'outline'} size="sm" onClick={() => setStatus(s)}>{s}</Button>
            ))}
          </div>
          <Input placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
          <Button onClick={add}>Add equipment</Button>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {items.map(p => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <CardDescription>{p.status}</CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap">{p.notes || '?'}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Conditions({ siteId }: { siteId: string }) {
  const { state, dispatch } = useAppStore()
  const [type, setType] = React.useState<'weather'|'field'|'bio'|'other'>('weather')
  const [note, setNote] = React.useState('')
  function add() {
    if (!note.trim()) return
    dispatch({ type: 'ADD_CONDITION', payload: { siteId, type, note } })
    setType('weather'); setNote('')
  }
  const items = state.conditions.filter(p => p.siteId === siteId)
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Log condition</CardTitle>
          <CardDescription>Weather, field, bio, or other.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            {(['weather','field','bio','other'] as const).map(s => (
              <Button key={s} type="button" variant={type===s? 'default':'outline'} size="sm" onClick={() => setType(s)}>{s}</Button>
            ))}
          </div>
          <Input placeholder="Note" value={note} onChange={e => setNote(e.target.value)} />
          <Button onClick={add}>Add</Button>
        </CardContent>
      </Card>
      <div className="grid gap-3">
        {items.map(p => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.type}</CardTitle>
              <CardDescription>{new Date(p.createdAt).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap">{p.note}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Analytics({ siteId }: { siteId: string }) {
  const { state } = useAppStore()
  const incidents = state.incidents.filter(x => x.siteId === siteId)
  const hazards = state.hazards.filter(x => x.siteId === siteId)
  const audits = state.audits.filter(x => x.siteId === siteId)
  const plans = state.plans.filter(x => x.siteId === siteId)
  const riskScore = hazards.reduce((acc, h) => acc + (h.risk === 'high' ? 3 : h.risk === 'medium' ? 2 : 1), 0)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>At a glance</CardTitle>
          <CardDescription>Simple snapshot to guide action.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>Incidents: <strong>{incidents.length}</strong></div>
          <div>Open audits: <strong>{audits.filter(a => a.status === 'open').length}</strong></div>
          <div>Plans: <strong>{plans.length}</strong></div>
          <div>Hazard risk score: <strong>{riskScore}</strong></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Assistant tip</CardTitle>
          <CardDescription>Based on your records</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {riskScore >= 9 ? 'Focus on high-risk hazards first. Assign controls and verify.' : 'Great job keeping risks noted. Consider a quick weekly audit.'}
        </CardContent>
      </Card>
    </div>
  )
}
