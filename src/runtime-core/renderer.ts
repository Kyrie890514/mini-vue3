import { effect } from "../reactivity/effect"
import { EMPTY_OBJ } from "../shared"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { shouldUpdateComponent } from "./componentUpdateUtils"
import { createAppApi } from "./createApp"
import { queueJobs } from "./scheduler"
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
		} else {
			let s1 = i, s2 = i
			const toBePatched = e2 - s2 + 1
			let patched = 0
			const keyToNewIndexMap = new Map()
			const newIndexToOldIndexMap = new Array(toBePatched).fill(0)
			let moved = false
			let maxNewIndexSoFar = 0
			for (let i = s2; i <= e2; i++) {
				const newChild = c2[i]
				keyToNewIndexMap.set(newChild.key, i)
			}
			for (let i = s1; i <= e1; i++) {
				const oldChild = c1[i]
				if (patched >= toBePatched) {
					hostRemove(oldChild.el)
					continue
				}
				let newIndex
				if (oldChild.key !== null && oldChild.key !== undefined) {
					newIndex = keyToNewIndexMap.get(oldChild.key)
				} else {
					for (let j = s2; j <= e2; j++) {
						if (isSameVnodeType(oldChild, c2[j])) {
							newIndex = j
							break
						}
					}
				}
				if (!newIndex) {
					hostRemove(oldChild.el)
				} else {
					if (newIndex > maxNewIndexSoFar) {
						maxNewIndexSoFar = newIndex
					} else {
						moved = true
					}
					newIndexToOldIndexMap[newIndex - s2] = i + 1
					patch(oldChild, c2[newIndex], container, parentComponent, null)
					patched++
				}
			}
			const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []
			let j = increasingNewIndexSequence.length - 1
			for (let i = toBePatched - 1; i >= 0; i--) {
				const newIndex = i + s2
				const newChild = c2[newIndex]
				const anchor = newIndex + 1 < c2.length ? c2[newIndex + 1].el : null
				if (newIndexToOldIndexMap[i] === 0) {
					patch(null, newChild, container, parentComponent, anchor)
				} else if (moved) {
					if (j < 0 || i !== increasingNewIndexSequence[j]) {
						hostInsert(newChild.el, container, anchor)
					} else {
						j--
					}
				}
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
		if (!n1) {
			mountComponent(n2, container, parentComponent, anchor)
		} else {
			updateComponent(n1, n2)
		}
	}

	function updateComponent(n1, n2) {
		const instance = n2.component = n1.component
		if (shouldUpdateComponent(n1, n2)) {
			instance.next = n2
			instance.update()
		} else {
			n2.el = n1.el
			instance.vnode = n2
		}
	}

	function mountComponent(initialVnode, container, parentComponent, anchor) {
		const instance = initialVnode.component = createComponentInstance(initialVnode, parentComponent)
		setupComponent(instance)
		setupRenderEffect(instance, initialVnode, container, anchor)
	}

	function setupRenderEffect(instance: any, initialVnode: any, container: any, anchor) {
		instance.update = effect(() => {
			if (!instance.isMounted) {
				const { proxy } = instance
				const subTree = instance.subTree = instance.render.call(proxy)
				patch(null, subTree, container, instance, anchor)
				initialVnode.el = subTree.el
				instance.isMounted = true
			} else {
				const { proxy, subTree: prevSubTree, next: newVnode, vnode: oldVnode } = instance
				if (newVnode) {
					newVnode.el = oldVnode.el
					updateComponentPreRender(instance, newVnode)
				}
				const subTree = instance.subTree = instance.render.call(proxy)
				instance.subTree = subTree
				patch(prevSubTree, subTree, container, instance, anchor)
			}
		}, {
			scheduler: () => {
				queueJobs(instance.update)
			}
		})
	}

	function updateComponentPreRender(instance, newVnode) {
		instance.vnode = newVnode
		instance.next = null
		instance.props = newVnode.props
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

function getSequence(arr: number[]): number[] {
	const p = arr.slice();
	const result = [0];
	let i, j, u, v, c;
	const len = arr.length;
	for (i = 0; i < len; i++) {
		const arrI = arr[i];
		if (arrI !== 0) {
			j = result[result.length - 1];
			if (arr[j] < arrI) {
				p[i] = j;
				result.push(i);
				continue;
			}
			u = 0;
			v = result.length - 1;
			while (u < v) {
				c = (u + v) >> 1;
				if (arr[result[c]] < arrI) {
					u = c + 1;
				} else {
					v = c;
				}
			}
			if (arrI < arr[result[u]]) {
				if (u > 0) {
					p[i] = result[u - 1];
				}
				result[u] = i;
			}
		}
	}
	u = result.length;
	v = result[u - 1];
	while (u-- > 0) {
		result[u] = v;
		v = p[v];
	}
	return result;
}