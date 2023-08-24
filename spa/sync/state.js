import { createSignal } from "solid-js"
import {mapObject} from "./util.js"

import { gCounter, pnCounter, mvRegister, gSet, orSet, optimizedORSet } from "./crdt.js"

// Reading
export { localFields, remoteFields, localButtons, remoteButtons, selectedCrdt }
// Writing
export { setSelectedCrdt, biDirectionalSync }

const crdts = {
	'g-counter': {
		local: createSignal(gCounter('local')),
		remote: createSignal(gCounter('remote'))
	},
	'pn-counter': {
		local: createSignal(pnCounter('local')),
		remote: createSignal(pnCounter('remote'))
	},
	'mv-register': {
		local: createSignal(mvRegister('local')),
		remote: createSignal(mvRegister('remote'))
	},
	'g-set': {
		local: createSignal(gSet()),
		remote: createSignal(gSet())
	},
	'or-set': {
		local: createSignal(optimizedORSet('local')),
		remote: createSignal(optimizedORSet('remote'))
	}
}

const [selectedCrdt, setSelectedCrdt] = createSignal(
	/**@type {keyof crdts} */ 'g-counter')

const getCrdtSystem = () => {
	const crdt = selectedCrdt()

	if (crdt in crdts) {
		// @ts-ignore
		return crdts[crdt]
	} else {
		return crdts['g-counter']
	}
}

const biDirectionalSync = () => {
	const c = getCrdtSystem()
	const {local: [local, setLocal], remote: [remote, setRemote]} = c

	/* 
		If I could make a CRDT trait this would work.
	*/
	//@ts-ignore
	setLocal(crdt => crdt.merge(remote()))
	//@ts-ignore
	setRemote(crdt => crdt.merge(local()))
}

/** @param {'local' | 'remote'} nodeId */
const getCrdt = nodeId => getCrdtSystem()[nodeId][0]()

/** @return VM.TextFields */
const localFields = () => getCrdt('local').textLabels
const remoteFields = () => getCrdt('remote').textLabels

const localButtons = () => {
	const [crdt, setCrdt] = getCrdtSystem().local
	return crdt().buttons(setCrdt)
}

const remoteButtons = () => {
	const [crdt, setCrdt] = getCrdtSystem().remote
	return crdt().buttons(setCrdt)
}
