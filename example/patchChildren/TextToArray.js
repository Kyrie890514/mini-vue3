import { ref, h } from '../../lib/mini-vue3.esm.js'

const newChildren = [h('div', {}, 'newA'), h('div', {}, 'newB')]
const oldChildren = 'oldChildren'

export default {
	name: 'ArrayToText',
	setup() {
		const isChange = ref(false)
		window.isChange = isChange
		return { isChange }
	},
	render() {
		return this.isChange
			? h('div', {}, newChildren)
			: h('div', {}, oldChildren)
	}
}