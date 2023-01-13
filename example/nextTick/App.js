import { h, ref, getCurrentInstance, nextTick } from '../../lib/mini-vue3.esm.js'

export const App = {
	name: 'App',
	render() {
		const button = h('button', { onClick: this.onClick }, 'update')
		const p = h('p', {}, 'count: ' + this.count)
		return h('div', {}, [button, p])
	},
	setup() {
		const count = ref(0)
		const instance = getCurrentInstance()
		const onClick = () => {
			for (let i = 0; i < 100; i++) {
				count.value = i
			}
			console.log(instance.vnode.el.innerText)
			nextTick(() => {
				console.log(instance.vnode.el.innerText)
			})
		}
		return {
			count, onClick
		}
	}
}