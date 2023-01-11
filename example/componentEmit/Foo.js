import { h } from '../../lib/mini-vue3.esm.js'

export const Foo = {
	name: 'Foo',
	setup(props, { emit }) {
		const emitAdd = () => {
			emit('add', 'Kyrie', '890514')
			emit('add-foo', 'Kyrie', '890514')
		}
		return { emitAdd }
	},
	render() {
		const btn = h('button',
			{
				onClick: this.emitAdd
			},
			'emitAdd')
		const foo = h('p', {}, 'Foo')
		return h('div', {}, [foo, btn])
	}
}