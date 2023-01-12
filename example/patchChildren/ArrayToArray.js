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
// const oldChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// ]
// const newChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'C' }, 'C'),
// 	h('p', { key: 'D' }, 'D'),
// ]

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

// 7.
// a b (c d) f g
// a b (e c) f g
// const oldChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'C', id: 'c-old' }, 'C'),
// 	h('p', { key: 'D' }, 'D'),
// 	h('p', { key: 'F' }, 'F'),
// 	h('p', { key: 'G' }, 'G'),
// ]
// const newChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'E' }, 'E'),
// 	h('p', { key: 'C', id: 'c-new' }, 'C'),
// 	h('p', { key: 'F' }, 'F'),
// 	h('p', { key: 'G' }, 'G'),
// ]

// 8.
// a b (c e d) f g
// a b (e c) f g
// const oldChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'C', id: 'c-old' }, 'C'),
// 	h('p', { key: 'E' }, 'E'),
// 	h('p', { key: 'D' }, 'D'),
// 	h('p', { key: 'F' }, 'F'),
// 	h('p', { key: 'G' }, 'G'),
// ]
// const newChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'E' }, 'E'),
// 	h('p', { key: 'C', id: 'c-new' }, 'C'),
// 	h('p', { key: 'F' }, 'F'),
// 	h('p', { key: 'G' }, 'G'),
// ]

// 9.
// a b (c d e) f g
// a b (e c d) f g
// const oldChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'C' }, 'C'),
// 	h('p', { key: 'D' }, 'D'),
// 	h('p', { key: 'E' }, 'E'),
// 	h('p', { key: 'F' }, 'F'),
// 	h('p', { key: 'G' }, 'G'),
// ]
// const newChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'E' }, 'E'),
// 	h('p', { key: 'C' }, 'C'),
// 	h('p', { key: 'D' }, 'D'),
// 	h('p', { key: 'F' }, 'F'),
// 	h('p', { key: 'G' }, 'G'),
// ]

// 10.
// a b (c e) f g
// a b (e c d) f g
// const oldChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'C' }, 'C'),
// 	h('p', { key: 'E' }, 'E'),
// 	h('p', { key: 'F' }, 'F'),
// 	h('p', { key: 'G' }, 'G'),
// ]
// const newChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'E' }, 'E'),
// 	h('p', { key: 'C' }, 'C'),
// 	h('p', { key: 'D' }, 'D'),
// 	h('p', { key: 'F' }, 'F'),
// 	h('p', { key: 'G' }, 'G'),
// ]

// 11.
// a b (c d e z) f g
// a b (d c y e) f g
// const oldChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'C' }, 'C'),
// 	h('p', { key: 'D' }, 'D'),
// 	h('p', { key: 'E' }, 'E'),
// 	h('p', { key: 'Z' }, 'Z'),
// 	h('p', { key: 'F' }, 'F'),
// 	h('p', { key: 'G' }, 'G'),
// ]
// const newChildren = [
// 	h('p', { key: 'A' }, 'A'),
// 	h('p', { key: 'B' }, 'B'),
// 	h('p', { key: 'D' }, 'D'),
// 	h('p', { key: 'C' }, 'C'),
// 	h('p', { key: 'Y' }, 'Y'),
// 	h('p', { key: 'E' }, 'E'),
// 	h('p', { key: 'F' }, 'F'),
// 	h('p', { key: 'G' }, 'G'),
// ]

// fix
// a c b d 
// a b c d 
const oldChildren = [
	h('p', { key: 'A' }, 'A'),
	h('p', {}, 'C'),
	h('p', { key: 'B' }, 'B'),
	h('p', { key: 'D' }, 'D'),
]
const newChildren = [
	h('p', { key: 'A' }, 'A'),
	h('p', { key: 'B' }, 'B'),
	h('p', {}, 'C'),
	h('p', { key: 'D' }, 'D'),
]


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