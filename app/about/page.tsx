import { Footer } from '@/components/ui/footer';
import { Header } from '@/components/header';

export const metadata = {
  title: 'About - woop',
  description: 'Copy here, paste there. Instantly share text across your devices.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="w-full border-b border-border/40 bg-zinc-50 dark:bg-black">
        <div className="mx-auto max-w-4xl px-6 py-3">
          <Header />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-6">
        <article className="space-y-6">
          <div>
            <h1 className="text-lg font-semibold">About</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Copy here, paste there.
            </p>
          </div>

          <section className="space-y-4 text-sm">
            <p className="text-muted-foreground leading-relaxed">
              woop is a clipboard sharing tool. It uses your public IP address
              to store and retrieve text via Redis. Open woop on any device on
              your network, and your woops are there.
            </p>

            <div className="space-y-2">
              <h2 className="font-medium">How it works</h2>
              <ol className="text-muted-foreground space-y-1 list-decimal list-inside text-sm">
                <li>Visit woop.foo</li>
                <li>Your public IP is detected automatically</li>
                <li>Type text and hit Enter</li>
                <li>Click any woop to copy it</li>
                <li>Open woop on another device — your woops are there</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h2 className="font-medium">Keyboard shortcuts</h2>
              <dl className="text-muted-foreground grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-sm">
                <dt className="font-mono text-xs">Tab</dt>
                <dd>Navigate between woops</dd>
                <dt className="font-mono text-xs">Enter</dt>
                <dd>Copy focused woop</dd>
                <dt className="font-mono text-xs">Backspace</dt>
                <dd>Delete focused woop</dd>
              </dl>
            </div>

            <div className="space-y-2">
              <h2 className="font-medium">Principles</h2>
              <ul className="text-muted-foreground space-y-0.5 text-sm">
                <li><span className="text-foreground">Fast</span> — Redis-backed, sub-millisecond lookups</li>
                <li><span className="text-foreground">Minimal</span> — Only what you need</li>
                <li><span className="text-foreground">Keyboard-first</span> — Navigate without lifting your mouse</li>
              </ul>
            </div>
          </section>
        </article>
      </main>
      <footer className="w-full border-t border-border/40">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <Footer />
        </div>
      </footer>
    </div>
  );
}
