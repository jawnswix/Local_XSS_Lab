# Local XSS Vulnerability Lab

A deliberately vulnerable training application for learning reflected, stored, and DOM-based Cross-Site Scripting (XSS).

## Safety

- The app binds to `127.0.0.1` only.
- Do not change the bind host to `0.0.0.0` or expose this service to the internet.
- Use only on your own machine and with harmless proof-of-execution payloads.
- Do not use real credentials, real user data, cookie theft, or external exfiltration.
- The vulnerable routes are intentional; never copy them into production code.

## Requirements

- Node.js 20+ and npm

## Run locally

```bash
npm install
npm start
```

Open <http://127.0.0.1:3000>.

## Optional Docker

```bash
docker compose up --build
```

The published port is explicitly bound to loopback (`127.0.0.1:3000`).

## Challenges and difficulty levels

Each XSS topic has its own Easy, Medium, and Hard challenge:

| Topic | Easy | Medium | Hard |
|---|---|---|---|
| Reflected XSS | `/reflected?level=easy` — HTML body | `/reflected?level=medium` — HTML attribute | `/reflected?level=hard` — JavaScript string |
| Stored XSS | `/stored?level=easy` — HTML body | `/stored?level=medium` — HTML attribute | `/stored?level=hard` — JavaScript string |
| DOM-based XSS | `/dom?level=easy` — fragment to HTML | `/dom?level=medium` — fragment to attribute | `/dom?level=hard` — decoded query to HTML |

Choose any level from the lab home page or switch levels using the navigation on each challenge page.

Use a harmless payload such as `<script>alert('XSS')</script>` to confirm execution in this local lab. For the DOM challenge, an event-handler payload can be used in a controlled local browser, e.g. `#<img src=x onerror=alert('DOM-XSS')>`.

## Suggested workflow

1. Read the route and template for the challenge.
2. Identify the source, the transformation, and the sink.
3. Confirm execution using a harmless alert.
4. Explain a realistic impact without collecting secrets or sending data off-device.
5. Patch the route by using context-appropriate output encoding and safe DOM APIs.
6. Retest that the same payload displays as text instead of executing.

## Architecture

Browser / Burp Suite → local Express app → EJS templates and SQLite database.
The browser runs the DOM-based challenge locally. The app is intentionally vulnerable for learning.
