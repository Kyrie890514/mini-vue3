export const App = {
	render() {
		return h('div', 'Hello, ' + this.msg)
	},
	setup() {
		return {
			msg: 'world.'
		}
	}
}