import { h, ref } from '../../lib/mini-vue3.esm.js'
import { Child } from './Child.js'

export const App = {
	name: 'App',
	setup() {
		const msg = ref('Kyrie')
		const count = ref(1)
		window.msg = msg
		const changeChildProps = () => {
			msg.value = '890514'
		}
		const changeCount = () => {
			count.value++
		}
		return {
			msg, count, changeChildProps, changeCount
		}
	},
	render() {
		return h('div', {}, [
			h('div', {}, 'App'),
			h('button', {
				onClick: this.changeChildProps,
			}, 'change child props'),
			h(Child, {
				msg: this.msg
			}),
			h('button', {
				onClick: this.changeCount
			}, 'change self count'),
			h('p', {}, 'count: ' + this.count)
		])
	}
}