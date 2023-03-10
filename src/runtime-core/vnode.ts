import { ShapeFlags } from "../shared/shapeFlags"

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export function createVnode(type, props?, children?) {
	const vnode = {
		type,
		props,
		children,
		shapeFlag: getShapeFlag(type),
		key: props && props.key,
		component: null,
		el: null
	}
	if (typeof children === 'string') {
		vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
	} else if (Array.isArray(children)) {
		vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
	}
	if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
		if (typeof children === 'object' && children !== null) {
			vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
		}
	}
	return vnode
}

export { createVnode as createElementVnode }

function getShapeFlag(type) {
	return typeof type === 'string'
		? ShapeFlags.ELEMENT
		: ShapeFlags.STATEFUL_COMPONENT
}

export function createTextVnode(text: string) {
	return createVnode(Text, {}, text)
}