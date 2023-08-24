import * as state from "./state.js"

import { render, For, Switch, Match } from "solid-js/web"
import { createSignal } from "solid-js"

/** @param {{vms: VM.SimpleButtons}} props */
const SimpleButtons = props => (
  <For each={props.vms}>
    {vm => <button onClick={vm.click}>{vm.label}</button>}
  </For>
)

/** @param {{vms: VM.TextButtons}} props */
const TextButtons = props => (
  <For each={props.vms}>
    {vm =>  {
    	const [text, setText] = createSignal('')

    	/** @param {Event} e */
			const handleTextChange = e => {
				const elem = /** @type HTMLSelectElement */ (e.target)
				setText(elem.value)
			}

    	const handleClick = () => vm.click(text())

    	return (
    		<>
    			<input for={vm.label} type="text" onChange={handleTextChange}/>
    			<button id={vm.label} onClick={handleClick}>{vm.label}</button>
    		</>
    	)
    }}
  </For>
)

/** @param {{vm: VM.TextLabels}} props */
const Text = props => (
	<>
		<span class="value">{props.vm.value}</span>
		<pre>{props.vm.state}</pre>
	</>
)

/**
 * @typedef {Object} CRDTProps
 * @property {string} name
 * @property {VM.TextLabels} labels
 * @property {{simple: VM.SimpleButtons, text: VM.TextButtons}} buttons
 */

/** @param {CRDTProps} props */
const CRDT = props => (
	<div class="crdt">
		<h2>{props.name}</h2>
		<Text vm={props.labels}/>
		<div class="updates">
			<SimpleButtons vms={props.buttons.simple}/>
			<TextButtons vms={props.buttons.text}/>
		</div>
	</div>
)

state.setSelectedCrdt(location.hash.substring(1))

window.addEventListener("hashchange", e => {
	state.setSelectedCrdt(location.hash.substring(1))
})

const App = () => {
	/** @param {Event} e */
	const handleSelectChange = e => {
		const elem = /** @type HTMLSelectElement */ (e.target)
		location.hash = `#${elem.value}`
	}

	return (
		<>
			<h1>Sync About It</h1>
			<label for="crdt-selector">CRDT:</label>
			<select name="CRDT" id="crdt-selector" onChange={handleSelectChange}>
				<option value="g-counter">Increment-Only Counter</option>
				<option value="pn-counter">Positive-Negative Counter</option>
				<option value="mv-register">Multi-Value Register</option>
				<option value="g-set">Grow-Only Set</option>
				<option value="or-set">Observed Remove Set</option>
			</select>		
			<div id="main-wrapper">
				<CRDT
					name="Local Node"
					labels={state.localFields()}
					buttons={state.localButtons()}/>
				
				<CRDT
					name="Remote Node"
					labels={state.remoteFields()}
					buttons={state.remoteButtons()}/>
			</div>
			<br/>
			<button onClick={state.biDirectionalSync} id="sync">Sync</button>
	  </>
	)
}

export default App
