import { createSignal } from "solid-js"
import {mapObject} from "./util.js"

import { gCounter, pnCounter, mvRegister, gSet, orSet, optimizedORSet } from "./crdt.js"

// Reading
export { localFields, remoteFields, localButtons, remoteButtons, selectedCrdt, options }
// Writing
export { setSelectedCrdt, biDirectionalSync }

const crdts = {
	'g-counter': {
		name: "Increment-Only Counter",
		local: createSignal(gCounter('local')),
		remote: createSignal(gCounter('remote'))
	},
	'pn-counter': {
		name: "Positive-Negative Counter",
		local: createSignal(pnCounter('local')),
		remote: createSignal(pnCounter('remote'))
	},
	'mv-register': {
		name: "Multi-Value Register",
		local: createSignal(mvRegister('local')),
		remote: createSignal(mvRegister('remote'))
	},
	'g-set': {
		name: "Grow-Only Set",
		local: createSignal(gSet()),
		remote: createSignal(gSet())
	},
	'or-set': {
		name: "Observed Remove Set",
		local: createSignal(optimizedORSet('local')),
		remote: createSignal(optimizedORSet('remote'))
	}
}


const options = Object.entries(crdts).map(([k, v]) => [k, v.name])

const [selectedCrdt, setSelectedCrdt] = createSignal(options[0][0])

const getCrdt = () => {
	const crdt = selectedCrdt()

	if (crdt in crdts) {
		// @ts-ignore
		return crdts[crdt]
	} else {
		return crdts['g-counter']
	}
}

const biDirectionalSync = () => {
	const c = getCrdt()
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
const crdt = nodeId => getCrdt()[nodeId]

/** @return VM.TextFields */
const localFields = () => crdt('local')[0]().textLabels
const remoteFields = () => crdt('remote')[0]().textLabels

const localButtons = () => {
	const [crdt, setCrdt] = getCrdt().local
	return crdt().buttons(setCrdt)
}

const remoteButtons = () => {
	const [crdt, setCrdt] = getCrdt().remote
	return crdt().buttons(setCrdt)
}
