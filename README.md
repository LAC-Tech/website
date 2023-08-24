## Project layout

### static/

Markdown. HTML, Original Images.

### spa/

Javascript code, dependencies and tooling. Each a

#### Dynamic/Sync

Sync contains my implementations of CRDTs from the following papers:

- "A comprehensive study of convergent and commutative replicated data types" (Marc Shapiro, Nuno Preguiça, Carlos Baquero, and Marek Zawirski)
- "An optimized conflict-free replicated set." (Annette Bieniusa, Marek Zawirski, Nuno Preguiça, Marc Shapiro, Carlos Baquero, Valter Balegas, and Sérgio Duarte)

All CRDTs implemented show their internal state, and have all been extensively tested for associativity, commutativity and idempotence using property based testing.

### www/

What's going to be served to the browser and deployed. Can contain things that don't need any processing, like CSS.

#### www/index.html

Front page is a simple static site, no js except google tag manager and a service worker.


## Running

TODO:
- makefile to build static assets
- vite for dynamic web pages
- devserve script to browse site

## FAQ

### Why not use vite for everything?

I'm no longer a frontend javascript true believer. Not willing to give up solid.js for SPAs, but want to limit the blast radius of frontend tooling.

Let Vite deal with javascript, and other stuff deal with transforming markdown to html.




