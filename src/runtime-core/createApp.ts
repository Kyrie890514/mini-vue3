import { createVnode } from "./vnode"
import { render } from "./renderer"

export function createApp(rootComponent) {
	return {
		mount(rootContainer) {
			const vnode = createVnode(rootComponent)
			render(vnode, rootContainer)
		}
	}
}