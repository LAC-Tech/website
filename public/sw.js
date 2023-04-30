//@ts-check

/// <reference path="../sw.d.ts"/>

const cacheName = '5676083d-9bd4-4a20-a005-deb9b599fe8d'

const worker = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (self));

worker.addEventListener('install', event => {
	event.waitUntil(caches.open(cacheName))
})

worker.addEventListener('fetch', event => {
	// Check if this is a navigation request
	const {request} = event

	/* 
		This hits the cache then the network.
		Assumes if the name of an image hasn't changed the image hasn't changed
	*/
	if (request.destination === 'image') {
		
		const res = tryCache(event).then(r => r ?? tryNetwork(event))
		return event.respondWith(res);
	} else if (
		request.destination === 'document' || 
		request.destination === 'style'
	) {
		// Network then cache
		const res = tryNetwork(event)
			.catch(() => tryCache(event))
			.then(r => r || new Response('', {status: 404}))

		return event.respondWith(res);
	}
});

/** @param {FetchEvent} event */
const tryNetwork = async event => {
	const [cache, response] = 
		await Promise.all([caches.open(cacheName), fetch(event.request.url)])
	
	cache.put(event.request, response.clone())
	return response;
}

/** @param {FetchEvent} event */
const tryCache = async event => {
	const cache = await caches.open(cacheName)
	return cache.match(event.request.url)
}
