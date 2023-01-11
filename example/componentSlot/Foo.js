import { h, renderSlots } from '../../lib/mini-vue3.esm.js'

export const Foo = {
	name: 'Foo',
	setup() {
		return {}
	},
	render() {
		const num = '890514'
		const foo = h('p', {}, 'Foo')
		console.log(this.$slots)
		return h('div', {}, [
			renderSlots(this.$slots, 'header', { num }),
			foo,
			renderSlots(this.$slots, 'footer')
		])
	}
}