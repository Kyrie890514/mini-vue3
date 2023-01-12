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
		patch(null, vnode, container, null, null)
	}

	function patch(n1, n2, container, parentComponent, anchor) {
		const { type, shapeFlag } = n2
		switch (type) {
			case Fragment:
				processFragment(n1, n2, container, parentComponent, anchor)
				break
			case Text:
				processText(n1, n2, container)
				break
			default:
				if (shapeFlag & ShapeFlags.ELEMENT) {
					processElement(n1, n2, container, parentComponent, anchor)
				} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
					processComponent(n1, n2, container, parentComponent, anchor)
				}
		}
	}

	function processElement(n1, n2, container, parentComponent, anchor) {
		if (n1) {
			patchElement(n1, n2, container, parentComponent, anchor)
		} else {
			mountElement(n2, container, parentComponent, anchor)
		}
	}

	function patchElement(n1, n2, container, parentComponent, anchor) {
		const el = n2.el = n1.el
		patchChildren(n1, n2, el, parentComponent, anchor)
		patchProps(el, n1.props || EMPTY_OBJ, n2.props || EMPTY_OBJ)
	}

	function patchChildren(n1, n2, container, parentComponent, anchor) {
		const oldShapeFlag = n1.shapeFlag
		const newShapeFlag = n2.shapeFlag
		const c1 = n1.children
		const c2 = n2.children
		if (newShapeFlag & ShapeFlags.TEXT_CHILDREN) {
			if (oldShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
				unMountChildren(n1.children)
			}
			if (c1 !== c2) {
				hostSetElementText(container, c2)
			}
		} else {
			if (oldShapeFlag & ShapeFlags.TEXT_CHILDREN) {
				hostSetElementText(container, '')
				mountChildren(n2, container, parentComponent, anchor)
			} else {
				patchKeyedChildren(c1, c2, container, parentComponent, anchor)
			}
		}
	}

	function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
		let i = 0
		let e1 = c1.length - 1
		let e2 = c2.length - 1
		while (i <= e1 && i <= e2) {
			const n1 = c1[i]
			const n2 = c2[i]
			if (isSameVnodeType(n1, n2)) {
				patch(n1, n2, container, parentComponent, parentAnchor)
			} else {
				break
			}
			i++
		}
		while (i <= e1 && i <= e2) {
			const n1 = c1[e1]
			const n2 = c2[e2]
			if (isSameVnodeType(n1, n2)) {
				patch(n1, n2, container, parentComponent, parentAnchor)
			} else {
				break
			}
			e1--
			e2--
		}
		if (i > e1) {
			if (i <= e2) {
				const nextPos = e2 + 1
				const anchor = nextPos < c2.length ? c2[nextPos].el : null
				while (i <= e2) {
					patch(null, c2[i], container, parentComponent, anchor)
					i++
				}
			}
		} else if (i > e2) {
			while (i <= e1) {
				hostRemove(c1[i].el)
				i++
			}
		}
	}

	function isSameVnodeType(n1, n2) {
		return n1.type === n2.type && n1.key === n2.key
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

	function mountElement(vnode, container, parentComponent, anchor) {
		const { type, children, props, shapeFlag } = vnode
		const el = vnode.el = hostCreateElement(type)
		if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
			hostSetElementText(el, children)
		} else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
			mountChildren(vnode, el, parentComponent, anchor)
		}
		for (const key in props) {
			const val = props[key]
			hostPatchProp(el, key, null, val)
		}
		hostInsert(el, container, anchor)
	}

	function mountChildren(vnode, container, parentComponent, anchor) {
		vnode.children.forEach(vnode => {
			patch(null, vnode, container, parentComponent, anchor)
		})
	}

	function processComponent(n1, n2, container, parentComponent, anchor) {
		mountComponent(n2, container, parentComponent, anchor)
	}

	function mountComponent(initialVnode, container, parentComponent, anchor) {
		const instance = createComponentInstance(initialVnode, parentComponent)
		setupComponent(instance)
		setupRenderEffect(instance, initialVnode, container, anchor)
	}

	function setupRenderEffect(instance: any, initialVnode: any, container: any, anchor) {
		effect(() => {
			if (!instance.isMounted) {
				const { proxy } = instance
				const subTree = instance.subTree = instance.render.call(proxy)
				patch(null, subTree, container, instance, anchor)
				initialVnode.el = subTree.el
				instance.isMounted = true
			} else {
				const { proxy, subTree: prevSubTree } = instance
				const subTree = instance.subTree = instance.render.call(proxy)
				instance.subTree = subTree
				patch(prevSubTree, subTree, container, instance, anchor)
			}
		})
	}

	function processFragment(n1, n2: any, container: any, parentComponent, anchor) {
		mountChildren(n2, container, parentComponent, anchor)
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