import { h } from '../../lib/mini-vue3.esm.js'

export const Child = {
	name: 'Child',
	setup() { },
	render() {
		return h('div', {}, [
			h('div', {}, 'Child-props-msg: ' + this.$props.msg)
		])
	}
}