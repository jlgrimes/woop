import { Footer } from '@/components/ui/footer';
import { Header } from '@/components/header';
import { Terminal } from '@/components/ui/code-block';

export const metadata = {
  title: 'About - woop',
  description: 'Copy here, paste there. Instantly share text across your devices.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black flex flex-col">
      <header className="w-full border-b border-border/40 bg-zinc-50 dark:bg-black">
        <div className="mx-auto max-w-4xl px-6 py-3">
          <Header />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-6 flex-1 w-full">
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
                <li>Your public IP is detected automatically (publicly available info anyways)</li>
                <li>Type text and hit Enter</li>
                <li>Click any woop to copy it</li>
                <li>Open woop on another device — your woops are there</li>
              </ol>
              <p className="text-muted-foreground leading-relaxed pt-2">
                You can also use the <a href="/cli" className="underline underline-offset-2 hover:text-foreground">woop CLI</a> to add a woop to your local network.
              </p>
              <Terminal code="npx woopfoo my super interesting note!" />
            </div>

            <div className="space-y-2">
              <h2 className="font-medium">Principles</h2>
              <ul className="text-muted-foreground space-y-0.5 text-sm">
                <li><span className="text-foreground">Fast</span> — Redis-backed, sub-millisecond lookups</li>
                <li><span className="text-foreground">Minimal</span> — Only what you need</li>
                <li><span className="text-foreground">Mouse-driven</span> — Hover to reveal actions, click to copy</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="font-medium">Data retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                Woops automatically expire after 7 days of inactivity. Each time
                you add a new woop, the timer resets.
              </p>
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
