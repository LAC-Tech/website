import { deepEquals, mergeWith } from './util'

export {create, max, incVV, extractVvs}

/** 
 * @param {string} initialId
 * @return {Model.NodeCounters}
 */
const create = initialId => new NodeCounters([[initialId, 0]])

/** @implements {Model.NodeCounters} */
class NodeCounters {
	_state
	/** @param {Array<[string, number]>} initialState */
	constructor(initialState) {
		initialState.sort(([id1, ], [id2, ]) => id1.localeCompare(id2))
		this._state = new Map(initialState)
	}

	/** @param {string} id */
	get(id) {
		return this._state.get(id)
	}

	/** 
	 * @param {string} id 
	 * @param {number} n
	 */
	set(id, n) {
		/** @type [string, number][] */
		const newState = [...this._state, [id, n]]
		return new NodeCounters(newState)
	}

	/** 
	 * @param {string} id 
	 * @return {Model.NodeCounters} 
	 */
	incr(id) {
		let n = this._state.get(id)
		/** @type [string, number][] */
		const newState = [...this._state, [id, (n ?? 0) + 1]]
		return new NodeCounters(newState)
	}

	sum() {
		return Array.from(this._state.values()).reduce((a, b) => a + b)
	}

	/** @param {NodeCounters} other */
	compare(other) {
		for (const k of this._state.keys()) {
			const [n1, n2] = [this._state.get(k), other._state.get(k)]
			if ((n1 ?? -1) > (n2 ?? -1 )) return false
		}

		return true
	}

	/** @param {NodeCounters} other */
	isConcurrent(other) {
	  for (let key in this._state) {
	    if (other._state.get(key) === undefined) return true
	  }

	  for (let key in other._state) {
	    if (this._state.get(key) === undefined) return true
	  }

	  return false
	}

	/** @param {NodeCounters} other */
	isGreaterThanOrEqual(other) {
	  for (let key in other._state) {
	  	const thisKey = this._state.get(key)
	    if (
	    	thisKey === undefined || 
	    	thisKey < (other._state.get(key) ?? -1)
	    ) {
	      return false;
	    }
	  }

	  return true;
	}

	/** @param {NodeCounters} other */
	merge(other) {
		const newState = mergeWith(
			(oldVal, newVal) => Math.max(oldVal, newVal),
			this._state, 
			other._state
		)

		// TODO: this is stupid, making an object, then converting it to pairs
		return new NodeCounters(Array.from(newState))
	}

	/** @param {NodeCounters} other */
	equals(other) {
		return deepEquals(this._state, other._state)
	}

	/** @param {NodeCounters} other */
	union(other) {
	  
	  const resultState = new Map(this._state)


	  for (const [key, value] of other._state) {
	    if (!resultState.has(key)) {
	      resultState.set(key, value);
	    }
	  }

	  let result = new NodeCounters([])
	  result._state = resultState

	  return result
	};

	/** 
	 * This notation is from 
	 * "Detection of Mutual Inconsistency in Distributed Systems" (1983)
	 */
	toString() {
		const internal = Array.from(this._state)
			.map(([k, v]) => `${k}:${v}`)
			.join(",")

		return `<${internal}>`
	}
}

/** @param {ReadonlyArray<Model.NodeCounters>} ncs */
const max = ncs => ncs.reduce((nc1, nc2) => nc1.compare(nc2) ? nc1 : nc2)

/**
 *	query incVV () : integer[n] V′
 * 		let g = myID()
 * 		let V = {V |∃x : (x, V ) ∈ S}
 * 		let V′ = [ maxV ∈V (V [j]) ]j6=g
 * 		let V′
 * 		[g] = maxV ∈V (V [g]) + 1
 * 
 * @param {ReadonlyArray<Model.NodeCounters>} ncs
 * @param {string} id
 * @return {Model.NodeCounters}
 */
const incVV = (ncs, id) => max(ncs).incr(id)

/** 
 * @param {Map<unknown, Model.NodeCounters>} ncs
 * @return {ReadonlyArray<Model.NodeCounters>}
 */
const extractVvs = ncs => Array.from(ncs.values())
