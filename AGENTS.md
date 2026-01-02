# AGENTS.md - AI Agent Documentation for woop

> This document provides comprehensive context for AI agents working on this codebase.

## Project Overview

**woop** is a dead-simple, Redis-backed clipboard sharing tool. It uses public IP addresses as keys to instantly share text snippets across devices on the same network.

- **Domain:** woop.foo
- **Core Philosophy:** Fast, minimal, mouse-driven
- **Tech Stack:** Next.js 16, React 19, Redis, TypeScript, Tailwind CSS 4

### The Core Idea

1. User visits woop.foo
2. Their public IP is detected automatically
3. They type text and hit Enter
4. Click any woop to copy it
5. Open woop on another device on the same network — woops are there

No accounts. No authentication. Just your IP address as your "key."

---

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Server Components) |
| UI | React 19, Tailwind CSS 4 |
| Database | Redis (via ioredis) |
| Animations | Framer Motion (`motion` package) |
| Components | Radix UI primitives, Shadcn/ui patterns |
| Icons | Lucide React |
| Encryption | Node.js crypto (AES-256-GCM) |

### Project Structure

```
woop/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Main clipboard page (Server Component)
│   ├── layout.tsx                # Root layout with fonts
│   ├── globals.css               # Tailwind styles
│   ├── about/page.tsx            # About page
│   ├── cli/page.tsx              # CLI documentation
│   ├── security/page.tsx         # Security details
│   └── api/push/route.ts         # POST API for CLI
├── components/
│   ├── ui/                       # Shadcn/Radix primitives (~25 files)
│   ├── motion-primitives/        # Animation components (text-morph, etc.)
│   ├── woop.tsx                  # Individual woop item
│   ├── woop-list.tsx             # List container
│   ├── woop-form.tsx             # Input form
│   ├── woop-input.tsx            # Auto-expanding textarea
│   ├── woop-provider.tsx         # Context + keyboard shortcuts
│   ├── header.tsx                # Navigation
│   ├── add-button.tsx            # Animated submit button
│   ├── animated-check.tsx        # Checkmark animation
│   ├── animated-nav-link.tsx     # Nav link with icon animation
│   └── empty-state.tsx           # Empty state message
├── cli/                          # CLI package (npx woopfoo)
│   ├── index.js                  # CLI entry point
│   └── package.json              # CLI package metadata
├── lib/
│   ├── redis.ts                  # Redis client singleton
│   ├── crypto.ts                 # Encryption/decryption/hashing
│   ├── entropy.ts                # Shannon entropy detection
│   └── utils.ts                  # cn() utility for class merging
└── [config files]
```

---

## Data Flow

### Adding a Woop

```
User types text → WoopInput (Enter) → WoopForm → Server Action: addWoop()
    → encrypt(text, ip) → redis.lpush(hashedKey, encrypted)
    → redis.expire(key, 7 days) → revalidatePath('/') → UI updates
```

### Viewing Woops

```
Visit woop.foo → Server Component extracts IP from headers
    → hashedKey = hashIP(ip) → redis.lrange(key, 0, -1)
    → decrypt each item → render WoopList
```

### Copying a Woop

```
Click woop → navigator.clipboard.writeText(text)
    → If selfDestructing: removeWoop() → item deleted from Redis
    → Else: show "Copied" feedback for 1.5s
```

---

## Security Model

### IP-Based Isolation

- Each public IP = separate encrypted keyspace
- Redis key = SHA-256(IP + CLIPBOARD_SALT)
- Cannot access another IP's data (different encryption key)

### Encryption

- **Algorithm:** AES-256-GCM (authenticated encryption)
- **Key Derivation:** SHA-256(IP + CLIPBOARD_SALT) → 32-byte key
- **IV:** Random 12 bytes per message
- **Storage Format:** base64(IV + authTag + ciphertext)

### Zero Knowledge

The server cannot decrypt stored data. Keys are derived from:
- Client's IP address (known only at request time)
- Server-side salt (never exposed to client)

### Data Retention

- Woops expire after **7 days** of inactivity
- Each new woop resets the TTL for that IP's entire list

---

## Key Components

### `app/page.tsx` - Home Page (Server Component)

- Extracts IP from headers (`x-forwarded-for` or `x-real-ip`)
- Loads and decrypts woops from Redis
- Defines Server Actions: `addWoop()`, `removeWoop()`
- Renders the main UI

### `components/woop.tsx` - Woop Item

- Displays individual clipboard entry
- Click to copy, right-click for context menu (delete)
- Hover reveals actions (copy icon, delete)
- Self-destructing woops have orange border + warning icon
- Uses `TextMorph` for "Copy" → "Copied" animation

### `components/woop-provider.tsx` - Context Provider

- Provides `addWoop` function to children via context
- Wraps `KeyboardShortcuts` component

### `components/keyboard-shortcuts.tsx`

- Global Ctrl/Cmd+V intercept → auto-paste as new woop
- Only activates when not focused on input

### `components/woop-input.tsx`

- Auto-expanding textarea (max 6 rows)
- Enter to submit, Shift+Enter for newline
- Uses `react-textarea-autosize`

### `lib/crypto.ts` - Cryptography

Key functions:
- `hashIP(ip)` → SHA-256 hash for Redis key
- `encrypt(text, ip)` → AES-256-GCM encrypted base64
- `decrypt(encrypted, ip)` → plaintext
- `deriveKey(ip)` → 32-byte encryption key

### `lib/redis.ts` - Redis Client

- Singleton pattern with global cache (dev mode)
- Uses `ioredis` package
- Connection via `REDIS_URL` env var

---

## API Endpoints

### POST `/api/push`

Used by CLI to add woops remotely.

```json
// Request
POST /api/push
Content-Type: application/json
{ "msg": "your message" }

// Response
200 "ok"
400 "missing msg"
```

Flow: Detect IP → Hash → Encrypt → Redis LPUSH → Set TTL

---

## CLI (`npx woopfoo`)

**Package:** `cli/` directory, published as `woopfoo` on npm

**Usage:**
```bash
npx woopfoo hello world
npx woopfoo "my message with spaces"
```

**How it works:**
1. Joins CLI args into message
2. POSTs to `https://woop.foo/api/push`
3. Server uses requester's IP for storage
4. Message appears on woop.foo for that network

---

## UI Patterns

### Mouse-Driven Interactions

- **Hover:** Reveals action buttons (copy, delete icons)
- **Click:** Copies text to clipboard
- **Right-click:** Context menu with delete option
- **Submit button:** Animates on hover (rotating plus icon)

### Animation Libraries

- **Framer Motion (`motion`):** Spring physics, layout animations
- **motion-primitives:** Pre-built animation components

### Key Animation Components

| Component | Purpose |
|-----------|---------|
| `TextMorph` | Character-by-character text morphing |
| `AnimatedCheck` | Checkmark that animates on mount |
| `PlusIcon` | Rotating plus with imperative API |

### Styling

- **Tailwind CSS 4** for utility classes
- **CVA (class-variance-authority)** for component variants
- **cn()** utility for conditional class merging

---

## Environment Variables

```env
CLIPBOARD_SALT=<64-char-hex>    # Required: Salt for IP hashing/encryption
REDIS_URL=<redis-connection>     # Required: Redis connection string
```

---

## Dependencies to Know

| Package | Purpose |
|---------|---------|
| `ioredis` | Redis client |
| `motion` | Framer Motion animations |
| `lucide-react` | Icon library |
| `@radix-ui/*` | Accessible UI primitives |
| `class-variance-authority` | Component variant styling |
| `react-textarea-autosize` | Auto-expanding textarea |
| `tailwind-merge` | Merge Tailwind classes |

---

## Common Tasks

### Adding a New Component

1. Create in `components/` or `components/ui/`
2. Use `'use client'` directive if it needs interactivity
3. Import with `@/components/...` path alias

### Adding Motion Primitives Components

```bash
npx motion-primitives@latest add <component-name>
```

Components are added to `components/motion-primitives/`

### Adding Shadcn Components

```bash
npx shadcn@latest add <component-name>
```

Components are added to `components/ui/`

### Working with Server Actions

Server Actions are defined in `app/page.tsx`:
- Mark with `'use server'`
- Call `revalidatePath('/')` after mutations
- Access via context or prop drilling

---

## Special Features

### Self-Destructing Woops

- Prefix: `SD:` in encrypted storage
- Visual: Orange border + `ShieldAlert` icon
- Behavior: Deleted immediately after copy

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd+V` | Auto-paste clipboard as new woop |
| `Enter` | Submit form |
| `Shift+Enter` | New line in input |
| `Tab` | Navigate focusable items |

---

## Code Style

- **TypeScript** with strict mode
- **ESLint 9** for linting
- **React Compiler** enabled for auto-optimization
- Prefer Server Components where possible
- Use `'use client'` only when necessary

---

## Testing Considerations

No automated tests currently. When testing manually:
- Test across different networks (different IPs)
- Verify encryption/decryption round-trips
- Test keyboard shortcuts
- Test self-destructing woop flow
- Test CLI from different machines

---

## Deployment

- **Host:** Vercel
- **Database:** Redis Labs (RedisCloud)
- **Domain:** woop.foo

Build command: `npm run build`

---

## Quick Reference

### File Locations

| What | Where |
|------|-------|
| Main page logic | `app/page.tsx` |
| Woop item component | `components/woop.tsx` |
| Encryption logic | `lib/crypto.ts` |
| Redis client | `lib/redis.ts` |
| API endpoint | `app/api/push/route.ts` |
| CLI code | `cli/index.js` |
| UI primitives | `components/ui/` |
| Animations | `components/motion-primitives/` |

### Key Patterns

- **Server Actions** for mutations (not API routes)
- **Context** for passing `addWoop` to children
- **Hover-reveal** for action buttons
- **Spring animations** for smooth transitions
- **IP-based isolation** for multi-tenant security
