"use client"
import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

export default function DashboardPage() {
  const { state, dispatch } = useAppStore()
  const [name, setName] = useState('')
  const [county, setCounty] = useState('')
  const [description, setDescription] = useState('')

  function addSite() {
    if (!name.trim()) return
    dispatch({ type: 'ADD_SITE', payload: { name: name.trim(), county: county.trim() || 'Unknown', description: description.trim() || undefined } })
    setName('')
    setCounty('')
    setDescription('')
  }

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Your Sites</h2>
          <p className="text-sm text-muted-foreground">Manage fields, barns, or facilities across Iowa counties.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add a site</CardTitle>
            <CardDescription>Keep it short and clear.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="mb-1 block text-sm">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. North 80 acres" />
            </div>
            <div>
              <label className="mb-1 block text-sm">County</label>
              <Input value={county} onChange={e => setCounty(e.target.value)} placeholder="e.g. Story County" />
            </div>
            <div>
              <label className="mb-1 block text-sm">Notes</label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="optional" />
            </div>
            <Button onClick={addSite}>Save site</Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid gap-4">
          {state.sites.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No sites yet</CardTitle>
                <CardDescription>Add your first site to get started.</CardDescription>
              </CardHeader>
            </Card>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {state.sites.map(site => (
              <Card key={site.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{site.name}</span>
                    <Link href={`/dashboard/${site.id}`}><Button size="sm" variant="outline">Open</Button></Link>
                  </CardTitle>
                  <CardDescription>{site.county}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{site.description || '?'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
