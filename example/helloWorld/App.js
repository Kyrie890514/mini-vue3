import { h } from '../../lib/mini-vue3.esm.js'

export const App = {
	render() {
		return h(
			'div',
			{
				id: 'root',
				class: ['Kyrie', '890514']
			},
			// 'Hello, ' + this.msg
			// 'Hello, world.'
			[h('span', {}, 'Hello '), h('span', {}, 'world.')]
		)
	},
	setup() {
		return {
			msg: 'world.'
		}
	}
}