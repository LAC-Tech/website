/**
 * Keep this file separate from app.jsx, just for HMR
 */
import { render } from "solid-js/web"

import App from './app'

const elem = document.getElementsByTagName("main")[0]
render(() => <App/>, elem)
