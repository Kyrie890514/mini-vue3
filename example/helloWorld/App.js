import { h } from '../../lib/mini-vue3.esm.js'

export const App = {
	render() {
		return h('div', 'Hello, ' + this.msg)
	},
	setup() {
		return {
			msg: 'world.'
		}
	}
}