"use client"
import React from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VoiceRecorder } from '@/components/voice-recorder'

export function ChatPanel({ siteId }: { siteId: string }) {
  const { state, dispatch } = useAppStore()
  const [value, setValue] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const messages = state.messagesBySite[siteId] ?? []

  React.useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent)?.detail as { siteId?: string; content?: string }
      if (detail?.siteId === siteId && detail.content) {
        void sendMessage(detail.content)
      }
    }
    window.addEventListener('assistant:quick', handler as any)
    return () => window.removeEventListener('assistant:quick', handler as any)
  }, [siteId])

  async function sendMessage(text: string) {
    if (!text.trim()) return
    dispatch({ type: 'ADD_MESSAGE', payload: { siteId, role: 'user', content: text.trim() } })
    setValue('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ siteId, messages: [...messages, { role: 'user', content: text.trim() }] }) })
      const data = await res.json()
      const reply = data?.reply || 'I noted that.'
      dispatch({ type: 'ADD_MESSAGE', payload: { siteId, role: 'assistant', content: reply } })
      if (typeof window !== 'undefined') {
        try {
          const utter = new SpeechSynthesisUtterance(reply)
          window.speechSynthesis.speak(utter)
        } catch {}
      }
    } catch (e) {
      dispatch({ type: 'ADD_MESSAGE', payload: { siteId, role: 'assistant', content: 'Network error. Saved your note.' } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto rounded-md border p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">Ask for a compliance plan, log an incident, or say "help me audit the grain bin."</p>
        )}
        {messages.map(m => (
          <div key={m.id} className="flex">
            <div className={`ml-auto max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{m.content}</div>
          </div>
        ))}
      </div>
      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={e => {
          e.preventDefault()
          sendMessage(value)
        }}
      >
        <Input value={value} onChange={e => setValue(e.target.value)} placeholder="Type a message?" />
        <VoiceRecorder onTranscript={t => sendMessage(t)} />
        <Button type="submit" disabled={loading}>{loading ? 'Thinking?' : 'Send'}</Button>
      </form>
    </div>
  )
}
