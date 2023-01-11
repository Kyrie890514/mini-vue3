import { h } from '../../lib/mini-vue3.esm.js'
import { Foo } from './Foo.js'

export const App = {
	name: 'App',
	render() {
		const app = h('div', {}, 'App')
		// const foo = h(Foo, {}, h('p', {}, 'Kyrie890514'))
		// const foo = h(Foo, {}, [h('p', {}, 'Kyrie'), h('p', {}, '80514')])
		const foo = h(Foo, {}, {
			header: h('p', {}, 'Kyrie'),
			footer: h('p', {}, '80514')
		})
		// const foo = h(Foo, {}, {
		// 	header: ({ num }) => h('p', {}, 'Kyrie' + num),
		// 	footer: () => h('p', {}, '11')
		// })
		return h('div', {}, [app, foo])
	},
	setup() {
		return {}
	}
}