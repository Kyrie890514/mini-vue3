import { h } from '../../lib/mini-vue3.esm.js'
import { Foo } from './Foo.js'

window.Kyrie = null
export const App = {
	name: 'App',
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
			// [h('span', {}, 'Hello '), h('span', {}, 'world.')]
			[h('div', {}, 'Hello ' + this.msg), h(Foo, { count: 11 })]
		)
	},
	setup() {
		return {
			msg: 'world.'
		}
	}
}