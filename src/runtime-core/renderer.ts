import { effect } from "../reactivity/effect"
import { EMPTY_OBJ } from "../shared"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppApi } from "./createApp"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
	const {
		createElement: hostCreateElement,
		patchProp: hostPatchProp,
		insert: hostInsert,
		createTextNode: hostCreateTextNode,
		remove: hostRemove,
		setElementText: hostSetElementText
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
			patchElement(n1, n2, container, parentComponent)
		} else {
			mountElement(n2, container, parentComponent)
		}
	}

	function patchElement(n1, n2, container, parentComponent) {
		const el = n2.el = n1.el
		patchChildren(n1, n2, el, parentComponent)
		patchProps(el, n1.props || EMPTY_OBJ, n2.props || EMPTY_OBJ)
	}

	function patchChildren(n1, n2, container, parentComponent) {
		const oldShapeFlag = n1.shapeFlag
		const newShapeFlag = n2.shapeFlag
		const oldChildren = n1.children
		const newChildren = n2.children
		if (newShapeFlag & ShapeFlags.TEXT_CHILDREN) {
			if (oldShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
				unMountChildren(n1.children)
			}
			if (oldChildren !== newChildren) {
				hostSetElementText(container, newChildren)
			}
		} else {
			if (oldShapeFlag & ShapeFlags.TEXT_CHILDREN) {
				hostSetElementText(container, '')
				mountChildren(n2, container, parentComponent)
			}
		}
	}

	function unMountChildren(children) {
		for (const child of children) {
			hostRemove(child.el)
		}
	}

	function patchProps(el, oldProps: any, newProps: any) {
		if (oldProps !== newProps) {
			for (const key in newProps) {
				const oldProp = oldProps[key]
				const newProp = newProps[key]
				oldProp !== newProp && hostPatchProp(el, key, oldProp, newProp)
			}
			if (oldProps !== EMPTY_OBJ) {
				for (const key in oldProps) {
					if (!(key in newProps)) {
						hostPatchProp(el, key, oldProps[key], null)
					}
				}
			}
		}
	}

	function mountElement(vnode, container, parentComponent) {
		const { type, children, props, shapeFlag } = vnode
		const el = vnode.el = hostCreateElement(type)
		if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
			hostSetElementText(el, children)
		} else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
			mountChildren(vnode, el, parentComponent)
		}
		for (const key in props) {
			const val = props[key]
			hostPatchProp(el, key, null, val)
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