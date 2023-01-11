import { shallowReadonly } from "../reactivity/reactive"
import { isObject } from "../shared/index"
import { initProps } from "./componentProps"
import { publicInstanceProxyHandlers } from "./componentPublicInstance"

export function createComponentInstance(vnode) {
	const component = {
		vnode,
		type: vnode.type,
		props: vnode.props,
		setupState: {}
	}
	return component
}

export function setupComponent(instance) {
	initProps(instance, instance.props)
	initSlots()
	setupStatefulComponent(instance)
}

function initSlots() { }

function setupStatefulComponent(instance: any) {
	const Component = instance.type
	instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers)
	const { setup } = Component
	if (setup) {
		const setupResult = setup(shallowReadonly(instance.props))
		handleSetupResult(instance, setupResult)
	}
}

function handleSetupResult(instance: any, setupResult: any) {
	if (isObject(setupResult)) {
		instance.setupState = setupResult
	}
	finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
	const Component = instance.type
	if (Component.render) {
		instance.render = Component.render
	}
}