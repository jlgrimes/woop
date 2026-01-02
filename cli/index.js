#!/usr/bin/env node

const msg = process.argv.slice(2).join(' ')

if (!msg) {
  console.log('Usage: woop "your message"')
  process.exit(1)
}

fetch('https://woop.foo/api/push', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ msg })
})
  .then(res => {
    if (res.ok) console.log('sent!')
    else console.log('failed:', res.status)
  })
  .catch(err => console.log('error:', err.message))
