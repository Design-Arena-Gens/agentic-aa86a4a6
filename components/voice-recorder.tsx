"use client"
import React from 'react'
import { Mic, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function VoiceRecorder({ onTranscript }: { onTranscript: (t: string) => void }) {
  const [recording, setRecording] = React.useState(false)
  const recognitionRef = React.useRef<any>(null)

  React.useEffect(() => {
    const SpeechRecognitionImpl = (typeof window !== 'undefined' && ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition)) as any
    if (!SpeechRecognitionImpl) return
    const recognition: any = new SpeechRecognitionImpl()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.onresult = (event: any) => {
      const transcript = Array.from<any>(event.results).map((r: any) => r[0]?.transcript).join(' ').trim()
      if (transcript) onTranscript(transcript)
    }
    recognition.onend = () => setRecording(false)
    recognitionRef.current = recognition
    return () => {
      try { recognition.stop() } catch {}
    }
  }, [onTranscript])

  function toggle() {
    const rec = recognitionRef.current
    if (!rec) return
    if (recording) {
      try { rec.stop() } catch {}
      setRecording(false)
    } else {
      try { rec.start() } catch {}
      setRecording(true)
    }
  }

  return (
    <Button type="button" onClick={toggle} variant={recording ? 'destructive' : 'secondary'} size="icon" title={recording ? 'Stop' : 'Record'}>
      {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  )
}
