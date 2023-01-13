import { proxyRefs } from "../reactivity"
import { shallowReadonly } from "../reactivity/reactive"
import { isObject } from "../shared/index"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { publicInstanceProxyHandlers } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"

export function createComponentInstance(vnode, parent) {
	const component = {
		vnode,
		type: vnode.type,
		props: vnode.props,
		slots: {},
		setupState: {},
		provides: parent ? parent.provides : {},
		parent,
		isMounted: false,
		next: null,
		subTree: {},
		emit: () => { }
	}
	component.emit = emit.bind(null, component) as any
	return component
}

export function setupComponent(instance) {
	initProps(instance, instance.props)
	initSlots(instance, instance.vnode.children)
	setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {
	const Component = instance.type
	instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers)
	const { setup } = Component
	if (setup) {
		setCurrentInstance(instance)
		const setupResult = setup(shallowReadonly(instance.props), {
			emit: instance.emit
		})
		setCurrentInstance(null)
		handleSetupResult(instance, setupResult)

	}
}

function handleSetupResult(instance: any, setupResult: any) {
	if (isObject(setupResult)) {
		instance.setupState = proxyRefs(setupResult)
	}
	finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
	const Component = instance.type
	if (Component.render) {
		instance.render = Component.render
	}
}

let currentInstance = null

export function getCurrentInstance() {
	return currentInstance
}

function setCurrentInstance(instance) {
	currentInstance = instance
}