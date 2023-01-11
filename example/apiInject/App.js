import { h, provide, inject } from '../../lib/mini-vue3.esm.js'

const Provider = {
	name: 'Provider',
	setup() {
		provide('foo', 'fooVal')
		provide('bar', 'barVal')
	},
	render() {
		return h('div', {}, [h('p', {}, 'Provider'), h(Middle)])
	}
}

const Middle = {
	name: 'Middle',
	setup() {
		provide('foo', 'fooVal2')
		provide('bar', 'barVal2')
		const foo = inject('foo')
		const bar = inject('bar')
		return {
			foo, bar
		}
	},
	render() {
		return h('div', {}, [h('p', {}, `Middle: ${this.foo}, ${this.bar}`), h(Consumer)])
	}
}

const Consumer = {
	name: 'consumer',
	setup() {
		const foo = inject('foo')
		const bar = inject('bar')
		const Kyrie = inject('Kyrie', () => 'Kyrie')
		return {
			foo, bar, Kyrie
		}
	},
	render() {
		return h('div', {}, `Consumer: ${this.foo}, ${this.bar} ${this.Kyrie}`)
	}
}

export const App = {
	name: 'App',
	render() {
		return h('div', {}, [h('p', {}, 'App'), h(Provider)])
	},
	setup() { }
}