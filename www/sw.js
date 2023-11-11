// In-case the cache ever gets filled with rubbish in prod, this can be changed
const cacheName = 'd44ece6c-bb0a-4dd9-9366-8205c5cfb2ff'

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(cacheName)
	)
})

// Remove old caches
self.addEventListener('activate', async event => {
    self.skipWaiting();

    const cacheNames = await caches.keys();

    const deletionPromises = cacheNames
        .filter(n => n !== cacheName)
        .map(n => caches.delete(n));

    await Promise.all(deletionPromises);
});

const whitelist = [
	"/",
	"/style.css",

	"/img/hashed/hero-71e9e86de8c6e29f.webp",

	"/img/hashed/icon32-a2fbcf30da694fcf.webp",
	"/img/hashed/icon46-112e6420dd915aad.webp",
	"/img/hashed/icon144-e73a392738ea4d4b.webp",
	"/img/hashed/icon192-4295d06a36017a35.webp",
	"/img/hashed/icon512-cd31b61c9fc843f4.webp",

	"/img/me_2022.webp",
	"/img/mark-toohey.webp",
	"/img/micha-veen.webp",
	"/img/bramford-horton.webp",
	
	"/manifest.json"
] 

/*
	Assumptions:
	- If an image has the same filename, it's the same image
	- html documents and CSS will change content but have the same name
*/

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

	cache.put(request, response.clone())


	return response;
}

const tryCache = async request => {
	const cache = await caches.open(cacheName)

	return cache.match(request.url)
}
