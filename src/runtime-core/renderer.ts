import { isOn } from "../shared/index"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode"

export function render(vnode, container) {
	patch(vnode, container)
}

function patch(vnode, container) {
	const { type, shapeFlag } = vnode
	switch (type) {
		case Fragment:
			processFragment(vnode, container)
			break
		case Text:
			processText(vnode, container)
			break
		default:
			if (shapeFlag & ShapeFlags.ELEMENT) {
				processElement(vnode, container)
			} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
				processComponent(vnode, container)
			}
	}
}

function processElement(vnode, container) {
	mountElement(vnode, container)
}

function mountElement(vnode, container) {
	const { type, children, props, shapeFlag } = vnode
	const el = vnode.el = document.createElement(type)
	if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
		el.textContent = children
	} else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
		mountChildren(vnode, el)
	}
	for (const key in props) {
		const val = props[key]
		if (isOn(key)) {
			const event = key.slice(2).toLowerCase()
			el.addEventListener(event, val)
		} else {
			el.setAttribute(key, val)
		}
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

function processFragment(vnode: any, container: any) {
	mountChildren(vnode, container)
}

function processText(vnode: any, container: any) {
	const { children } = vnode
	const textNode = vnode.el = document.createTextNode(children)
	container.append(textNode)
}