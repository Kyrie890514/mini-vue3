import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppApi } from "./createApp"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
	const {
		createElement: hostCreateElement,
		patchProp: hostPatchProp,
		insert: hostInsert,
		createTextNode: hostCreateTextNode
	} = options

	function render(vnode, container) {
		patch(vnode, container, null)
	}

	function patch(vnode, container, parentComponent) {
		const { type, shapeFlag } = vnode
		switch (type) {
			case Fragment:
				processFragment(vnode, container, parentComponent)
				break
			case Text:
				processText(vnode, container)
				break
			default:
				if (shapeFlag & ShapeFlags.ELEMENT) {
					processElement(vnode, container, parentComponent)
				} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
					processComponent(vnode, container, parentComponent)
				}
		}
	}

	function processElement(vnode, container, parentComponent) {
		mountElement(vnode, container, parentComponent)
	}

	function mountElement(vnode, container, parentComponent) {
		const { type, children, props, shapeFlag } = vnode
		const el = vnode.el = hostCreateElement(type)
		if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
			el.textContent = children
		} else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
			mountChildren(vnode, el, parentComponent)
		}
		for (const key in props) {
			const val = props[key]
			hostPatchProp(el, key, val)
		}
		hostInsert(el, container)
	}

	function mountChildren(vnode, container, parentComponent) {
		vnode.children.forEach(vnode => {
			patch(vnode, container, parentComponent)
		})
	}

	function processComponent(vnode, container, parentComponent) {
		mountComponent(vnode, container, parentComponent)
	}

	function mountComponent(initialVnode, container, parentComponent) {
		const instance = createComponentInstance(initialVnode, parentComponent)
		setupComponent(instance)
		setupRenderEffect(instance, initialVnode, container)
	}

	function setupRenderEffect(instance: any, initialVnode: any, container: any) {
		const { proxy } = instance
		const subTree = instance.render.call(proxy)
		patch(subTree, container, instance)
		initialVnode.el = subTree.el
	}

	function processFragment(vnode: any, container: any, parentComponent) {
		mountChildren(vnode, container, parentComponent)
	}

	function processText(vnode: any, container: any) {
		const { children } = vnode
		const textNode = vnode.el = hostCreateTextNode(children)
		container.append(textNode)
		hostInsert(textNode, container)
	}
	return {
		createApp: createAppApi(render)
	}
}