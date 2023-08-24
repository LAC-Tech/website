import { describe, expect } from 'vitest'
import { test, fc } from '@fast-check/vitest'

import { nanoid } from "nanoid"

import * as crdt from '../src/crdt.js'

/**
 * @template Value
 * @typedef {import("@fast-check/vitest").fc.Arbitrary<Model.CRDT<Value>>} ArbitraryCRDT<Value>
 */

// TODO: high enough?
const streamLen = 100

const gCounter = fc.nat({max: streamLen}).map(len => {
	let initial = crdt.gCounter(nanoid(10))

	for(let i = 0; i < len; i++) {
		initial = initial.incr()
	}

	return initial
})

const pnCounter = fc.infiniteStream(fc.oneof(
	fc.constant(/** @type {const} */ ('incr')), 
	fc.constant(/** @type {const} */ ('decr')))
).map(commands => {
	let initial = crdt.pnCounter(nanoid(10))

	for (const command of commands.take(streamLen)) {
		initial = initial[command]()
	}

	return initial
})

const mvRegister = fc.infiniteStream(fc.string()).map(newPayloads => {
	let initial = crdt.mvRegister(nanoid(10))

	for (const payload of newPayloads.take(streamLen)) {
		initial = initial.assign(payload)
	}

	return initial
})

const gSet = fc.infiniteStream(fc.string()).map(newPayloads => {
	let initial = crdt.gSet()

	for (const payload of newPayloads.take(streamLen)) {
		initial = initial.add(payload)
	}

	return initial
})

const orSet = fc.infiniteStream(
	fc.record({
		command: fc.oneof(
			fc.constant(/** @type {const} */ ('add')),
			fc.constant(/** @type {const} */ ('remove'))
		),
		elem: fc.string()
	})).map(ops => {
	
	let initial = crdt.optimizedORSet(nanoid(10))

	for (const {command, elem} of ops.take(streamLen)) {
		initial = initial[command](elem)
	}

	return initial
})

/** 
 * @template Value
 * @param {ArbitraryCRDT<Value>} arb
 */
const commutativeProperty = arb => fc.property(
	fc.tuple(arb, arb),
	//@ts-ignore
	([a, b]) => a.merge(b).equals(b.merge(a)))

/**
 * @template Value
 * @param {ArbitraryCRDT<Value>} arb
 */
const associativeProperty = arb => fc.property(
	fc.record({a: arb, b: arb, c: arb}),
	//@ts-ignore
	({a, b, c}) => (a.merge(b)).merge(c).equals(a.merge(b.merge(c))))

/** 
 * @template Value
 * @param {ArbitraryCRDT<Value>} arb++
 */
const idempotentProperty = arb => fc.property(
	arb,
	//@ts-ignore
	a => a.merge(a).equals(a))

describe("Grow-Only Counters", () => {
	test("commutative", () => fc.assert(commutativeProperty(gCounter)))
	test("associative", () => fc.assert(associativeProperty(gCounter)))
	test("idempotent", () => fc.assert(idempotentProperty(gCounter)))

	test('initializing', () => {
		const gcounter = crdt.gCounter(nanoid(10))
		expect(gcounter.query()).toBe(0)
	})

	test('incrementing', () => {
		const gcounter = crdt.gCounter(nanoid(10))
		expect(gcounter.incr().query()).toBe(1)
	})

	test('merging', () => {
		const local = crdt.gCounter(nanoid(10))
		const remote = crdt.gCounter(nanoid(10))

		expect(local.incr().merge(remote).query()).toBe(1)
	})

	test("valueOf id node", () => {
		const a = crdt.gCounter(nanoid(10))
		const b = crdt.gCounter(nanoid(10))

		const lhs = a.merge(b)
		const rhs = b.merge(a)

		expect(lhs.equals(rhs)).toBeTruthy()
	})
})

describe("Positive Negative Counter", () => {
	test("commutative", () => fc.assert(commutativeProperty(pnCounter)))
	test("associative", () => fc.assert(associativeProperty(pnCounter)))
	test("idempotent", () => fc.assert(idempotentProperty(pnCounter)))

	test('initializing', () => {
		const pncounter = crdt.pnCounter(nanoid(10))
		expect(pncounter.query()).toBe(0)
	})

	test('incrementing', () => {
		const pncounter = crdt.pnCounter(nanoid(10))
		expect(pncounter.incr().query()).toBe(1)
	})

	test('decrementing', () => {
		const pncounter = crdt.pnCounter(nanoid(10))
		expect(pncounter.decr().query()).toBe(-1)
	})

	test("merging", () => {
		const local = crdt.pnCounter(nanoid(10)).incr().incr()
		const remote = crdt.pnCounter(nanoid(10)).incr().incr()

		const actual = local.merge(remote)

		expect(actual.query()).toBe(4)
	})

	test("example from amazon whitepaper, figure 3 chatper 4", () => {
		let x = crdt.mvRegister(nanoid(10))
		let y = crdt.mvRegister(nanoid(10))
		let z = crdt.mvRegister(nanoid(10))

		x = x.assign('d1')
		//@ts-ignore
		y = y.merge(x)
		//@ts-ignore
		z = z.merge(x)

		x = x.assign('d2x')
		expect(x.query()).toStrictEqual(['d2x'])

		y = y.assign('d2y')
		z = z.assign('d2z')

		//@ts-ignore
		x = x.merge(y)
		//@ts-ignore
		x = x.merge(z)

		expect(x.query()).toStrictEqual(['d2x', 'd2y', 'd2z'])
	})
})

describe("Multi-Value Register", () => {
	test("commutative", () => fc.assert(commutativeProperty(mvRegister)))
	test("associative", () => fc.assert(associativeProperty(mvRegister)))
	test("idempotent", () => fc.assert(idempotentProperty(mvRegister)))
})

describe("Grow-Only Set", () => {
	test("commutative", () => fc.assert(commutativeProperty(gSet)))
	test("associative", () => fc.assert(associativeProperty(gSet)))
	test("idempotent", () => fc.assert(idempotentProperty(gSet)))
})

describe("OR-Set", () => {
	test("commutative",	() => fc.assert(commutativeProperty(orSet)))
	test("associative",	() => fc.assert(associativeProperty(orSet)))
	test("idempotent",	() => fc.assert(idempotentProperty(orSet)))

	test("don't display duplicate elements", () => {
		const o = crdt.optimizedORSet(nanoid(10)).add("cat").add("cat")
		expect(o.textLabels.value).toEqual("cat")
	})

	test("should be able to remove an element", () => {
		const a = crdt.optimizedORSet(nanoid(10)).add("cat").remove("cat")
		expect(a.query()).toStrictEqual([])
	})

	test("two nodes with the same ID might as well work", () => {
		const a1 = crdt.optimizedORSet(nanoid(10)).add("cat").add("dog").add("rat")
		const a2 = crdt.optimizedORSet(nanoid(10)).add("horse").add("cat")

		const lhs = a1.merge(a2)
		const rhs = a2.merge(a1)

		expect(lhs.textLabels.state).toEqual(rhs.textLabels.state)
	})
})
