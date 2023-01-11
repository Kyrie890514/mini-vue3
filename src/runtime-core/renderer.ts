import { isObject } from "../shared/index"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
	patch(vnode, container)
}

function patch(vnode, container) {
	if (typeof vnode.type === 'string') {
		processElement(vnode, container)
	} else if (isObject(vnode.type)) {
		processComponent(vnode, container)
	}
}

function processElement(vnode, container) {
	mountElement(vnode, container)
}

function mountElement(vnode, container) {
	const { type, children, props } = vnode
	const el = vnode.el = document.createElement(type)
	if (typeof children === 'string') {
		el.textContent = children
	} else if (Array.isArray(children)) {
		mountChildren(vnode, el)
	}
	for (const key in props) {
		const val = props[key]
		el.setAttribute(key, val)
	}
	container.append(el)
}

function mountChildren(vnode, container) {
	vnode.children.forEach(vnode => {
		patch(vnode, container)
	})
}

function processComponent(vnode, container) {
	mountComponent(vnode, container)
}

function mountComponent(initialVnode, container) {
	const instance = createComponentInstance(initialVnode)
	setupComponent(instance)
	setupRenderEffect(instance, initialVnode, container)
}

function setupRenderEffect(instance: any, initialVnode: any, container: any) {
	const { proxy } = instance
	const subTree = instance.render.call(proxy)
	patch(subTree, container)
	initialVnode.el = subTree.el
}