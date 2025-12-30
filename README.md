# woop

**woop.foo** - Copy here, paste there. Instantly share text and files across your devices.

## What is woop?

woop is a dead-simple clipboard sharing tool. It uses your public IP address as a key to store and retrieve text snippets via Redis. Open woop on any device on your network, and your woops are there waiting.

## Principles

- **Blazing fast** - Load and operations are instant. Redis-backed storage ensures sub-millisecond lookups.
- **Minimal** - Only what is needed on the page. No clutter, no distractions.
- **Functional** - Every feature is intentionally programmed. Nothing superfluous.
- **Keyboard-navigatable** - Simple keyboard actions navigate the entire site. You shouldn't need to lift your mouse to get your text.

## How it works

1. Visit woop.foo
2. Your public IP is detected automatically
3. Type text and hit Add (or press Enter)
4. Click any woop to copy it to your clipboard
5. Open woop on another device on your network - your woops are there

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Tab` / `Shift+Tab` | Navigate between woops |
| `Enter` | Copy focused woop to clipboard |
| `Backspace` | Delete focused woop |

## Tech stack

- **Next.js 16** with App Router and Server Actions
- **React 19** with React Compiler
- **Redis** via IORedis for blazing fast storage
- **Tailwind CSS 4** for minimal styling
- **TypeScript** throughout

## Getting started

### Prerequisites

- Node.js 18+
- Redis instance (local or hosted)

### Setup

```bash
# Install dependencies
npm install

# Set your Redis URL
export REDIS_URL="redis://localhost:6379"

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start wooping.

### Production

```bash
npm run build
npm start
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `REDIS_URL` | Redis connection string (required) |

## License

MIT
