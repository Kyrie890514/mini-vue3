import { h, ref } from '../../lib/mini-vue3.esm.js'

export const App = {
	name: 'App',
	setup() {
		const count = ref(0)
		const onClick = () => {
			count.value++
		}
		const props = ref({
			foo: 'foo',
			bar: 'bar'
		})
		const onChangePropsDemo1 = () => {
			props.value.foo = 'new-foo'
		}
		const onChangePropsDemo2 = () => {
			props.value.foo = undefined
		}
		const onChangePropsDemo3 = () => {
			props.value = {
				foo: 'foo'
			}
		}
		return {
			count,
			onClick,
			onChangePropsDemo1,
			onChangePropsDemo2,
			onChangePropsDemo3,
			props
		}
	},
	render() {
		return h(
			'div',
			{
				id: 'root',
				...this.props
			},
			[
				h('div', {}, 'count: ' + this.count),
				h('button', { onClick: this.onClick }, 'click'),
				h('button', { onClick: this.onChangePropsDemo1 }, 'changeProps - value changed - modify'),
				h('button', { onClick: this.onChangePropsDemo2 }, 'changeProps - value changed to undefined - delete'),
				h('button', { onClick: this.onChangePropsDemo3 }, 'changeProps - key changed - delete'),
			]
		)
	}
}