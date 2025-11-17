import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { AppStoreProvider } from '@/lib/store'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Iowa Ag EHS ? AI-first Safety',
  description: 'Minimal, farmer-friendly EHS management with AI and voice.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-background text-foreground`}>
        <AppStoreProvider>
          <header className="border-b">
            <div className="container-page flex h-16 items-center justify-between">
              <Link href="/" className="text-lg font-semibold">Iowa Ag EHS</Link>
              <nav className="text-sm text-muted-foreground">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              </nav>
            </div>
          </header>
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <footer className="border-t">
            <div className="container-page py-4 text-xs text-muted-foreground">Built for Iowa farmers ? safety first.</div>
          </footer>
        </AppStoreProvider>
      </body>
    </html>
  )
}
