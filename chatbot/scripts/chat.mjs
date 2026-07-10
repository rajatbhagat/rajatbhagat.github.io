#!/usr/bin/env node
// Terminal chat client for local testing.
//
//   npm run chat                       interactive REPL
//   npm run chat -- "one question"     one-shot
//
// The worker must be running in another terminal (`npm run dev`).
// Point at a deployed worker with CHAT_URL=https://... npm run chat
import readline from 'node:readline/promises';

const URL = process.env.CHAT_URL ?? 'http://localhost:8787/chat';

async function ask(question) {
  let res;
  try {
    res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
  } catch {
    console.error(`Could not reach ${URL} — is the worker running? (npm run dev)`);
    process.exit(1);
  }
  if (!res.ok) {
    console.error(`HTTP ${res.status}: ${await res.text()}`);
    return;
  }
  for await (const chunk of res.body.pipeThrough(new TextDecoderStream())) {
    process.stdout.write(chunk);
  }
  process.stdout.write('\n');
}

const oneShot = process.argv.slice(2).join(' ').trim();
if (oneShot) {
  await ask(oneShot);
} else {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log(`Chatting with ${URL} — empty line or Ctrl+C to exit.\n`);
  for (;;) {
    const q = (await rl.question('you > ')).trim();
    if (!q) break;
    process.stdout.write('\nbot > ');
    await ask(q);
    console.log();
  }
  rl.close();
}
