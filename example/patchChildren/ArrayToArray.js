import { ref, h } from '../../lib/mini-vue3.esm.js'

// 1. compare left
// (a b) c
// (a b) d e
// const oldChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'C' }, 'C'),
// ]
// const newChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'D' }, 'D'),
// 	h('p', { key: 'E' }, 'E'),
// ]

// 2. compare right
// a (b c)
// d e (b c)
// const oldChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'C' }, 'C'),
// ]
// const newChildren = [
// 	h('p', { key: 'D' }, 'D'),
// 	h('p', { key: 'E' }, 'E'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'C' }, 'C'),
// ]

// 3. add right
// (a b)
// (a b) c d
const oldChildren = [
	h('p', { key: 'A' }, 'A'),
	h('p', { key: 'B' }, 'B'),
]
const newChildren = [
	h('p', { key: 'A' }, 'A'),
	h('p', { key: 'B' }, 'B'),
	h('p', { key: 'C' }, 'C'),
	h('p', { key: 'D' }, 'D'),
]

// 4. add left
// (a b)
// c d (a b)
// const oldChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// ]
// const newChildren = [
// 	h('p', { key: 'C' }, 'C'),
// 	h('p', { key: 'D' }, 'D'),
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// ]

// 5. remove right
// (a b) c d
// (a b)
// const oldChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'C' }, 'C'),
// 	h('p', { key: 'D' }, 'D'),
// ]
// const newChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// ]

// 6. remove left
// c d (a b)
// (a b)
// const oldChildren = [
// 	h('p', { key: 'C' }, 'C'),
// 	h('p', { key: 'D' }, 'D'),
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// ]
// const newChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// ]

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