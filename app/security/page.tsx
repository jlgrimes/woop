import { Footer } from '@/components/ui/footer';
import { Header } from '@/components/header';

export const metadata = {
  title: 'Security - woop',
  description: 'How woop keeps your clipboard data safe and encrypted',
};

export default function SecurityPage() {
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
            <h1 className="text-lg font-semibold">Security</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              How woop keeps your data safe.
            </p>
          </div>

          <section className="space-y-4 text-sm">
            <div className="space-y-1">
              <h2 className="font-medium">Encrypted storage</h2>
              <p className="text-muted-foreground leading-relaxed">
                Every woop is encrypted using AES-256-GCM. The key is derived
                from your public IP, so only devices on your network can
                decrypt your data.
              </p>
            </div>

            <div className="space-y-1">
              <h2 className="font-medium">Network isolation</h2>
              <p className="text-muted-foreground leading-relaxed">
                Woops are isolated by public IP. Devices on your home Wi-Fi,
                office, or hotspot share the same clipboard. Different network,
                different woops.
              </p>
            </div>

            <div className="space-y-1">
              <h2 className="font-medium">Zero knowledge</h2>
              <p className="text-muted-foreground leading-relaxed">
                We cannot read your woops. Your IP is hashed with SHA-256
                before storage. No accounts, no passwords, no tracking.
              </p>
            </div>
          </section>

          <section className="rounded border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-3 space-y-1">
            <h2 className="font-medium text-sm">Trust your network</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Anyone on your network can access your woops. This is by design.
              Use password-protected Wi-Fi and avoid public networks.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
              Technical specs
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Encryption</dt>
                <dd className="font-mono">AES-256-GCM</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Key derivation</dt>
                <dd className="font-mono">PBKDF2</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">IP hashing</dt>
                <dd className="font-mono">SHA-256</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Storage</dt>
                <dd className="font-mono">Redis</dd>
              </div>
            </dl>
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
