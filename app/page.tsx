// app page.tsx
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            <span className="text-xl font-bold">TidyInbox</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-background to-muted py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
              Take Control of Your Inbox
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Easily manage your email subscriptions, unsubscribe from unwanted newsletters, and keep your inbox clean and organized.
            </p>
            <Link href="/login">
              <Button size="lg" className="font-semibold">
                Get Started with Google
              </Button>
            </Link>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Connect Your Email</h3>
                <p className="text-muted-foreground">
                  Securely connect your Google account to scan for subscription emails.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Review Subscriptions</h3>
                <p className="text-muted-foreground">
                  See all your subscriptions in one place with smart suggestions on what to keep or remove.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold">Unsubscribe with Ease</h3>
                <p className="text-muted-foreground">
                  Bulk unsubscribe from unwanted emails with a single click and keep your inbox clean.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">Ready to declutter your inbox?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
              Join thousands of users who have simplified their email management and reclaimed their inbox.
            </p>
            <Link href="/login">
              <Button size="lg" className="font-semibold">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span className="font-semibold">TidyInbox</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TidyInbox. All rights reserved.
            </p>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}