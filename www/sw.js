const cacheName = '8354a47c-fe3a-4282-827b-be5a896d1f0c'

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(cacheName)
	)
})

self.addEventListener('activate', async event => {
	self.skipWaiting()

  const cache = await caches.open(cacheName)
  const cacheKeys = await cache.keys()

  const deletionPromises = cacheKeys
    .filter(cacheKey => !whitelist.includes(new URL(cacheKey.url).pathname))
    .map(cacheKey => cache.delete(cacheKey))

  await Promise.all(deletionPromises)
})

const whitelist = [
	"/",
	"/style.css",

	"/img/hashed/hero-c65d046d64c3e8b6.webp",

	"/img/hashed/icon32-a2fbcf30da694fcf.webp",
	"/img/hashed/icon46-112e6420dd915aad.webp",
	"/img/hashed/icon144-e73a392738ea4d4b.webp",
	"/img/hashed/icon192-4295d06a36017a35.webp",
	"/img/hashed/icon512-cd31b61c9fc843f4.webp",

	"/img/tabler-brand-twitter.svg",
	"/img/tabler-brand-linkedin.svg",
	"/img/tabler-brand-youtube.svg",
	"/img/tabler-brand-github.svg",
	"/img/tabler-code.svg",
	"/img/tabler-report-analytics.svg",
	"/img/tabler-tie.svg",

	"/manifest.json"
] 

self.addEventListener('fetch', event => {
	// Check if this is a navigation request
	const {request} = event

	/* 
		This hits the cache then the network.
		Assumes if the name of an image hasn't changed the image hasn't changed
	*/
	if (request.destination === 'image') {
		
		const res = tryCache(request).then(r => r ?? tryNetwork(request))
		return event.respondWith(res);
	} else if (
		request.destination === 'document' || 
		request.destination === 'style'
	) {
		// Network then cache
		const res = tryNetwork(request)
			.catch(() => tryCache(request))
			.then(r => r || new Response('', {status: 404}))

		return event.respondWith(res);
	}
})

const tryNetwork = async request => {
	const [cache, response] = await Promise.all([
		caches.open(cacheName), 
		fetch(request.url)
	])

	const url = new URL(request.url)

	if (whitelist.includes(url.pathname)) {
		cache.put(request, response.clone())
	}

	return response;
}

const tryCache = async request => {
	const cache = await caches.open(cacheName)


	return cache.match(request.url)
}
