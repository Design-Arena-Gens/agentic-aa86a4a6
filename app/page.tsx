import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="container-page py-12">
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">AI-first EHS for Iowa Agriculture</h1>
        <p className="mt-4 text-muted-foreground">Talk to your EHS assistant. Manage sites, audits, incidents, and more ? simply.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/dashboard"><Button>Open Dashboard</Button></Link>
          <Link href="/dashboard"><Button variant="outline">Start with a Site</Button></Link>
        </div>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Built for farmers</CardTitle>
            <CardDescription>Simple, clear, and mobile-friendly. No clutter.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Quickly log incidents, plan compliance, and keep crews safe across fields, barns, and storage sites.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI + voice</CardTitle>
            <CardDescription>Hands busy? Speak. The assistant handles the paperwork.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Use chat or voice to draft audits, record hazards, and generate action plans you can review and send.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
