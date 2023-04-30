# My Website

## index.html

Front page is a simple static site, no js except google tag manager and a service worker.

## sync.html

Sync contains my implementations of CRDTs from the following papers:

- "A comprehensive study of convergent and commutative replicated data types" (Marc Shapiro, Nuno Preguiça, Carlos Baquero, and Marek Zawirski)
- "An optimized conflict-free replicated set." (Annette Bieniusa, Marek Zawirski, Nuno Preguiça, Marc Shapiro, Carlos Baquero, Valter Balegas, and Sérgio Duarte)

All CRDTs implemented show their internal state, and have all been extensively tested for associativity, commutativity and idempotence using property based testing.

# Current way to start

npm run dev

Currently using vite to serve the whole thing in dev.

TODO: solution for static html templating. Probably just simpler to run rake/make separately.

# Old way to start

This is structured as a caddy sever proxied by browser-sync.
This way I can get live page updates on my phone, while caddy itself can be a reverse proxy for any server side scripts I may wish to run.

So, to start:

- caddy run
- ./devserve.sh
