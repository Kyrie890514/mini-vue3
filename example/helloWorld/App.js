import { h } from '../../lib/mini-vue3.esm.js'

window.Kyrie = null
export const App = {
	render() {
		window.Kyrie = this
		return h(
			'div',
			{
				id: 'root',
				class: ['Kyrie', '890514'],
				onClick() {
					console.log('click')
				},
				onMousedown() {
					console.log('mousedown')
				}
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