declare namespace Model {
	interface NodeCounters {
		get(id: string): number | undefined
		set(id: string, n: number): NodeCounters
		incr(id: string): NodeCounters
		sum(): number
		compare(other: NodeCounters): boolean
		isConcurrent(other: NodeCounters): boolean
		isGreaterThanOrEqual(other: NodeCounters): boolean
		merge(other: NodeCounters): NodeCounters
		equals(other: NodeCounters): boolean
	}

	// TODO: don't need State
	interface CRDT<Value> extends VM.CRDT<Value> {
	  // state: State
	  query(): Value
	  merge(other: CRDT<Value>): CRDT<Value>
	  equals(other: CRDT<Value>): boolean
	}

	interface GCounter extends CRDT<number> {
		incr(): GCounter
	}

	interface PNCounter extends CRDT<number> {
		incr(): PNCounter
		decr(): PNCounter
	}

	interface MVRegister extends CRDT<ReadonlyArray<string>> {
		assign(other: string): MVRegister
	}

	interface GSet extends CRDT<ReadonlyArray<string>> {
		add(e: string): GSet
	}

	interface ORSet extends CRDT<ReadonlyArray<string>> {
		add(e: string): ORSet
		remove(e: string): ORSet
	}

	type Key = "g-counter" | "pn-counter" | "mv-register" | "g-set" | "or-set"
}

type Accessor<T> = import("solid-js").Accessor<T>
type Setter<T> = import("solid-js").Setter<T>
type Signal<T> = import("solid-js").Signal<T>

declare namespace VM {
	type SimpleButton = {readonly label: string, click(): void}
	type TextButton = {readonly label: string, click(t: string): void}

	type SimpleButtons = ReadonlyArray<SimpleButton>
	type TextButtons = ReadonlyArray<TextButton>

	interface TextLabels {
		readonly value: string
		readonly state: string
	}

	interface CRDT<Value> {
	  buttons(setter: Setter<Model.CRDT<Value>>): {
	  	simple: SimpleButtons
	  	text: TextButtons
	  }
	  readonly textLabels: TextLabels
	}
}
