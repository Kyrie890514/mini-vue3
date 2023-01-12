import { effect } from "../reactivity/effect"
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
		patch(null, vnode, container, null)
	}

	function patch(n1, n2, container, parentComponent) {
		const { type, shapeFlag } = n2
		switch (type) {
			case Fragment:
				processFragment(n1, n2, container, parentComponent)
				break
			case Text:
				processText(n1, n2, container)
				break
			default:
				if (shapeFlag & ShapeFlags.ELEMENT) {
					processElement(n1, n2, container, parentComponent)
				} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
					processComponent(n1, n2, container, parentComponent)
				}
		}
	}

	function processElement(n1, n2, container, parentComponent) {
		if (n1) {
			patchElement(n1, n2, container)
		} else {
			mountElement(n2, container, parentComponent)
		}
	}

	function patchElement(n1, n2, container) {
		console.log('patchElement', n1, n2)

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
			patch(null, vnode, container, parentComponent)
		})
	}

	function processComponent(n1, n2, container, parentComponent) {
		mountComponent(n2, container, parentComponent)
	}

	function mountComponent(initialVnode, container, parentComponent) {
		const instance = createComponentInstance(initialVnode, parentComponent)
		setupComponent(instance)
		setupRenderEffect(instance, initialVnode, container)
	}

	function setupRenderEffect(instance: any, initialVnode: any, container: any) {
		effect(() => {
			if (!instance.isMounted) {
				const { proxy } = instance
				const subTree = instance.subTree = instance.render.call(proxy)
				patch(null, subTree, container, instance)
				initialVnode.el = subTree.el
				instance.isMounted = true
			} else {
				const { proxy, subTree: prevSubTree } = instance
				const subTree = instance.subTree = instance.render.call(proxy)
				instance.subTree = subTree
				patch(prevSubTree, subTree, container, instance)
			}
		})
	}

	function processFragment(n1, n2: any, container: any, parentComponent) {
		mountChildren(n2, container, parentComponent)
	}

	function processText(n1, n2: any, container: any) {
		const { children } = n2
		const textNode = n2.el = hostCreateTextNode(children)
		container.append(textNode)
		hostInsert(textNode, container)
	}
	return {
		createApp: createAppApi(render)
	}
}