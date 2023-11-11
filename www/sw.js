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
		request.destination === 'style' ||
		request.url.includes('manifest.json')
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

	cache.put(request, response.clone())

	return response;
}

const tryCache = async request => {
	const cache = await caches.open(cacheName)
	return cache.match(request.url)
}
