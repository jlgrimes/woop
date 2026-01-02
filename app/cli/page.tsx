import { Footer } from '@/components/ui/footer';
import { Header } from '@/components/header';

export const metadata = {
  title: 'CLI - woop',
  description: 'Send woops from your terminal with zero config.',
};

export default function CLIPage() {
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
            <h1 className="text-lg font-semibold">CLI</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Send woops from your terminal.
            </p>
          </div>

          <section className="space-y-4 text-sm">
            <p className="text-muted-foreground leading-relaxed">
              The woop CLI lets you send text to your clipboard from any terminal.
              No install required — just use npx.
            </p>

            <div className="space-y-2">
              <h2 className="font-medium">Quick start</h2>
              <pre className="bg-zinc-100 dark:bg-zinc-900 rounded-md p-3 text-xs font-mono overflow-x-auto">
                <code>npx woopfoo hello world</code>
              </pre>
              <p className="text-muted-foreground text-xs">
                That&apos;s it. Your text appears on woop.foo instantly.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="font-medium">Usage</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground mb-1">Without quotes:</p>
                  <pre className="bg-zinc-100 dark:bg-zinc-900 rounded-md p-3 text-xs font-mono overflow-x-auto">
                    <code>npx woopfoo meeting notes from standup</code>
                  </pre>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">With quotes (preserves multiple spaces):</p>
                  <pre className="bg-zinc-100 dark:bg-zinc-900 rounded-md p-3 text-xs font-mono overflow-x-auto">
                    <code>npx woopfoo &quot;text with    multiple spaces&quot;</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-medium">How it works</h2>
              <ol className="text-muted-foreground space-y-1 list-decimal list-inside text-sm">
                <li>CLI sends your text to woop.foo</li>
                <li>Your public IP is detected from the request</li>
                <li>Text is encrypted and stored in Redis</li>
                <li>Open woop.foo on any device on your network to see it</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h2 className="font-medium">Requirements</h2>
              <ul className="text-muted-foreground space-y-0.5 text-sm">
                <li><span className="text-foreground">Node.js 18+</span> — for native fetch support</li>
                <li><span className="text-foreground">npx</span> — comes with npm</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="font-medium">Global install (optional)</h2>
              <p className="text-muted-foreground mb-2">
                If you use it often, install globally for faster execution:
              </p>
              <pre className="bg-zinc-100 dark:bg-zinc-900 rounded-md p-3 text-xs font-mono overflow-x-auto">
                <code>npm install -g woopfoo{'\n'}woopfoo your message here</code>
              </pre>
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
