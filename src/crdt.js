import * as util from './util'
import * as nc from './nodecounters'

export {gCounter, pnCounter, mvRegister, gSet, orSet}

/** @type {(id: string) => Model.GCounter} */
const gCounter = id => new GCounter(id)

/** @implements {Model.GCounter} */
class GCounter {	
	#id; _state

	/** @param {string} id */
	constructor(id, state = nc.create(id)) {
		this.#id = id
		this._state = state
	}

	/** @returns {Model.GCounter} */
	incr() {
		return new GCounter(this.#id, this._state.incr(this.#id))
	}

	query() { return this._state.sum() }

	/** @param {GCounter} other */
	merge(other) {
		return new GCounter(this.#id, this._state.merge(other._state))
	}

	/** @param {GCounter} other */
	equals(other) {
		return this._state.equals(other._state)
	}

	toString() {
		return this._state.toString()
	}

	/** @param {Setter<Model.GCounter>} setter */
	buttons(setter) {
		return {
			simple: [
				{label: "increment", click: () => setter(this.incr())}
			],
			text: []
		}
	}

	get textLabels() {
		return {
			value: this.query().toString(),
			state: this._state.toString()
		}
	}
}

/** @type {(id: string) => Model.PNCounter} */
const pnCounter = id => new PNCounter(id)

/** @implements {Model.PNCounter} */
class PNCounter {
	#id

	/** @param {string} id */
	constructor(id, state = {p: nc.create(id), n: nc.create(id)}) {
		this.#id = id
		this._counters = state
	}

	/** @param {'p' | 'n'} key */
	#update(key) { 
		const newState = {
			...this._counters, 
			[key]: this._counters[key].incr(this.#id)
		}
		
		return new PNCounter(this.#id, newState)
	}

	/** @returns {Model.PNCounter} */
	incr() { return this.#update('p') }
	/** @returns {Model.PNCounter} */
	decr() { return this.#update('n') }

	query() { return this._counters.p.sum() - this._counters.n.sum() }

	/** @param {PNCounter} other */
	merge(other) {
		return new PNCounter(this.#id, {
			p: this._counters.p.merge(other._counters.p),
			n: this._counters.n.merge(other._counters.n)
		})
	}

	/** @param {PNCounter} other */
	equals(other) {
		return (
			this._counters.p.equals(other._counters.p) &&
			this._counters.n.equals(other._counters.n)
		)
	}

	/** @param {Setter<Model.PNCounter>} setter */
	buttons(setter) {
		return { 
			simple: [
				{label: "increment", click: () => setter(this.incr())},
				{label: "decrement", click: () => setter(this.decr())}
			],
			text: []
		}
	}
			
	get textLabels() {
		return {
			value: this.query().toString(),
			state: `Positive: ${this._counters.p}\nNegative: ${this._counters.n}`
		}
	}
}

/** @type {(id: string) => Model.MVRegister} */
const mvRegister = id => new MVRegister(id, new Map([["", nc.create(id)]]))

/** @implements {Model.MVRegister} */
class MVRegister {
	#id

	/**
	 * @param {string} id
	 * @param {Map<string, Model.NodeCounters>} state
	 */
	constructor(id, state = new Map()) {
		this.#id = id
		// Sorting for printing and deep equality
		this._payload = new Map([...state].sort())

		this.vm = {

		}
	}

	/** @param {string} payload */
	assign(payload) {
		const v = nc.incVV(nc.extractVvs(this._payload), this.#id)
		return new MVRegister(this.#id, new Map([[payload, v]]))
	}

	query() {
		return Array.from(this._payload.keys())
	}

	/** @param {MVRegister} other */
	equals(other) {
		return util.deepEquals(this._payload, other._payload)
	}

	/** @param {MVRegister} other */
	merge(other) {
		const lhs = new Map();
		
		for (const [key1, value1] of this._payload.entries()) {
		  let isConcurrentOrGreater = true;
		  for (const [key2, value2] of other._payload.entries()) {
		    if (
		    	!value1.isConcurrent(value2) && 
		    	!value1.isGreaterThanOrEqual(value2)
		    ) {
		      isConcurrentOrGreater = false;
		      break;
		    }
		  }
		  if (isConcurrentOrGreater) {
		    lhs.set(key1, value1);
		  }
		}

		const rhs = new Map()

		for (const [key1, value1] of other._payload.entries()) {
		  let isConcurrentOrGreater = true;
		  for (const [key2, value2] of this._payload.entries()) {
		    if (!value1.isConcurrent(value2) && !value1.isGreaterThanOrEqual(value2)) {
		      isConcurrentOrGreater = false;
		      break;
		    }
		  }
		  if (isConcurrentOrGreater) {
		    rhs.set(key1, value1);
		  }
		}

		const merged = util.mergeWith((left, right) => left.merge(right), lhs, rhs)

		return new MVRegister(this.#id, merged)
	}

	toString() {
		return `(id: ${this.#id}, state: [${this._payload}])`
	}

	/** @param {Setter<Model.MVRegister>} setter */
	buttons(setter) {
		return {
			simple: [],
			text: [
				{
					label: "assign", 
					textField: '',
					/** @param {string} t */
					click: t => setter(this.assign(t))
				}
			]
		}
	}
			
	get textLabels() {
		return {
			value: this.query().join(', '),
			state: Array.from(this._payload.entries())
				.map(([id, nn]) => `${id}: ${nn}`)
				.join("\n")
		}
	}
}

/** @type {() => Model.GSet} */
const gSet = () => new GSet(new Set())

/** @implements {Model.GSet} */
class GSet {
	/** @param {Set<string>} state */
	constructor(state) {
		// Sorting for printing and deep equality
		this._state = new Set([...state].sort())
	}

	/** @param {string} e */
	add(e) {
		return new GSet(new Set([...this._state, e]))
	}

	query() {
		return Array.from(this._state)
	}

	/** 
	 * Part of the specification in the paper, but not useful for web app
	 * @param {string} e
	 */
	lookup(e) {
		return this._state.has(e)
	}

	/** @param {GSet} other */
	merge(other) {
		return new GSet(util.setUnion(this._state, other._state))
	}

	/** @param {GSet} other */
	equals(other) {
		return util.deepEquals(this._state, other._state)
	}

				/** @param {Setter<Model.GSet>} setter */
	buttons(setter) {
		return {
			simple: [],
			text: [
				{
					label: "assign", 
					textField: '',
					/** @param {string} t */
					click: t => setter(this.add(t))
				}
			]
		}
	}
			
	get textLabels() {
		return {
			value: this.query().join(', '),
			state: `{${Array.from(this._state).join(', ')}}`
		}
	}
}

/** @return {Model.ORSet} */
const orSet = () => new ORSet([], [])

class ORSetElement {
	/** @param {string} e */
	constructor(e) {
		this._value = e
		this._id = util.uuid()
	}

	/** @param {ORSetElement} other */
	compare(other) {
		if (this._value !== other._value) {
			return this._value.localeCompare(other._value)
		} else {
			return JSON.stringify(this._id).localeCompare(JSON.stringify(other._id))
		}
	}

	/** @param {string} e */
	matches(e) {
		return this._value === e
	}

	/** @param {ORSetElement} other */
	equals(other) {
		return (this._value == other._value) && (this._id === other._id)
	}

	/** @param {Uint8Array} bytes */
	static #toHexString = bytes => Array.from(bytes)
		.map(byte => (byte.toString(16).padStart(2, '0')))
		.join('')


	toString() {
		return `<${this._value}:${ORSetElement.#toHexString(this._id)}>`
	}
}

/** @implements {Model.ORSet} */
class ORSet {

	/** @type {(xs: ORSetElement[], ys: ORSetElement[]) => ORSetElement[]} */
	static relativeComplement = util.relativeComplement((x, y) => x.equals(y))

	/** @type {(xs: ORSetElement[], ys: ORSetElement[]) => ORSetElement[]} */
	static union = util.arrayUnion((x, y) => x.equals(y))

	/** 
	 * @param {ORSetElement[]} elements
	 * @param {ORSetElement[]} tombstones
	 */
	constructor(elements, tombstones) {
		this._elements = elements
		this._tombstones = tombstones

		this._elements.sort((x, y) => x.compare(y))
		this._tombstones.sort((x, y) => x.compare(y))
	}

	/** @param {string} e */
	contains(e) {
		return this._elements.some(elem => elem.matches(e))
	}

	query() {
		const es = this._elements.map(elem => elem._value)
		return Array.from(new Set(es))
	}

	/** @param {string} e */
	add(e) {
		const newElements = ORSet.relativeComplement(
			[...this._elements, new ORSetElement(e)],
			this._tombstones
		)

		return new ORSet(newElements, this._tombstones)
	}

	/** @param {string} e */
	remove(e) {
		const tagsToRemove = this._elements.filter(elem => elem.matches(e))

		const newElements = ORSet.relativeComplement(this._elements, tagsToRemove)
		const newTombstones = ORSet.union(this._tombstones, tagsToRemove)

		return new ORSet(newElements, newTombstones)
	}

	/** @param {ORSet} other */
	equals(other) {
		return (
			util.deepEquals(this._elements, other._elements) &&
			util.deepEquals(this._tombstones, other._tombstones)
		)
	}

	/** @param {ORSet} other */
	merge(other) {
		const newElements = ORSet.union(
			ORSet.relativeComplement(this._elements, other._tombstones),
			ORSet.relativeComplement(other._elements, this._tombstones)
		)

		const newTombstones = ORSet.union(this._tombstones, other._tombstones)

		return new ORSet(newElements, newTombstones)
	}

	toString() {
		return JSON.stringify({
			elements: this._elements,
			tombstones: this._tombstones
		}) 
	}

	/** @param {Setter<Model.ORSet>} setter */
	buttons(setter) {
		return {
			simple: [],
			text: [
				{
					label: "add", 
					textField: '',
					/** @param {string} t */
					click: t => setter(this.add(t))
				},
				{
					label: "remove",
					textField: '',
					/** @param {string} t */
					click: t => setter(this.remove(t))
				}
			]
		}
	}

	get textLabels() {
		return {
			value: this.query().join(', '),
			state: [
				"Elements:",
				...this._elements,
				"\n",

				"Tombstones:",
				...this._tombstones
			].join("\n")
		}
	}
}

class OptimizedORSetElement {
	/** @type {(xs: ORSetElement[], ys: ORSetElement[]) => ORSetElement[]} */
	static union = util.arrayUnion((x, y) => x.equals(y))
	
	/**
	 * @param {string} value
	 * @param {number} counter
	 * @param {string} id
	 */
	constructor(value, counter, id) {
		this.value = value
		this.counter = counter
		this.id = id
	}

	/** @param {OptimizedORSetElement} other */
	compare(other) {
		if (this.value !== other.value) {
			return this.value.localeCompare(other.value)
		} else if (this.counter !== other.counter) {
			return this.counter - other.counter
		}	else {
			return this.id.localeCompare(other.id)
		}
	}

	/** 
	 * @param {string} newValue
	 * @param {number} newCount
	 * @param {string} id
	 */
	isUpToDate(newValue, newCount, id) {
		if (this.value !== newValue) return true
		if (id !== this.id) return true
		return this.counter >= newCount
	}

	/** @param {string} newValue */
	matches(newValue) {
		return this.value === newValue
	}

	/** @param {OptimizedORSetElement} other */
	equals(other) {
		return (
			this.value === other.value && 
			this.counter === other.counter &&
			this.id === other.id
		)
	}

	toString() {
		return `("${this.value}", ${this.counter}, "${this.id}")`
	}
}

/** @type {(id: string) => Model.ORSet} */
export const optimizedORSet = id => new OptimizedORSet(id, [], nc.create(id))

/** @implements {Model.ORSet} */
class OptimizedORSet {
	#id

	/**
	 * @param {string} id
	 * @param {OptimizedORSetElement[]} elements
	 * @param {Model.NodeCounters} vectors
	 */
	constructor(id, elements, vectors) {
		this.#id = id
		this._elements = elements

		this._elements.sort((a, b) => a.compare(b))

		this._vector = vectors
	}

	query() {
		const values = this._elements.map(e => e.value)
		return Array.from(new Set(values))
	}

	/** @param {string} e */
	add(e) {
		const newVectors = this._vector.incr(this.#id)

		const newCount = /** @type number */ (newVectors.get(this.#id))

		const newElements = this._elements
			.concat([new OptimizedORSetElement(e, newCount, this.#id)])
			.filter(elem => elem.isUpToDate(e, newCount, this.#id))

		return new OptimizedORSet(this.#id, newElements, newVectors)
	}

	/** @param {string} e */
	remove(e) {
		const newElements = this._elements.filter(elem => !elem.matches(e))
		return new OptimizedORSet(this.#id, newElements, this._vector)
	}

	/** @param {OptimizedORSet} other */
	merge(other) {
		const m = OptimizedORSet.union(this._elements, other._elements)

		const m1 = OptimizedORSet.relativeComplement(
			this._elements,
			other._elements
		).filter(e => e.counter > (other._vector.get(e.id) ?? -1))

		const m2 = OptimizedORSet.relativeComplement(
			other._elements,
			this._elements
		).filter(e => e.counter > (this._vector.get(e.id) ?? -1))

		const u = OptimizedORSet.union(m, OptimizedORSet.union(m1, m2))

		/** @type {OptimizedORSetElement[]} */
		const newElements = []
	  
	  for (const e of u) {
	  	const m = newElements
	  		.find(elem => e.value === elem.value && e.id === elem.id)

	    if (m === undefined || m && e.counter > m.counter) {
	      newElements.push(e)
	    }
	  }

	  const newVector = this._vector.merge(other._vector)

	  return new OptimizedORSet(this.#id, newElements, newVector)
	}
	
	static relativeComplement = util.relativeComplement(
		/** 
		 * @param {OptimizedORSetElement} e1
		 * @param {OptimizedORSetElement} e2
		 */
		(e1, e2) => e1.equals(e2)
	)

	static union = util.arrayUnion(
		/** 
		 * @param {OptimizedORSetElement} e1
		 * @param {OptimizedORSetElement} e2
		 */
		(e1, e2) => e1.equals(e2)
	)

	/** @param {OptimizedORSet} other */
	equals(other) {
		return (
			util.deepEquals(this._elements, other._elements) &&
			util.deepEquals(this._vector, other._vector)
		)
	}

	toString() {
		return [
			`id: ${this.#id}`,
			`elements: \n${this._elements.map(e => `\t${e}`).join("\n")}`,
			`vector: ${this._vector}`
		].join("\n")
	}
	
	/** @param {Setter<Model.ORSet>} setter */
	buttons(setter) {
		return {
			simple: [],
			text: [
				{
					label: "add", 
					textField: '',
					/** @param {string} t */
					click: t => setter(this.add(t))
				},
				{
					label: "remove",
					textField: '',
					/** @param {string} t */
					click: t => setter(this.remove(t))
				}
			]
		}
	}

	get textLabels() {
		return {
			value: this.query().join(', '),
			state: [
				"Elements:",
				...this._elements,
				"\n",
				"Vector:",
				this._vector,
			].join("\n")
		}
	}
}
