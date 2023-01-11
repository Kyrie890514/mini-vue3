import { isObject } from "../shared/index"
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers"

export const enum ReactiveFlags {
	IS_REACTIVE = '__v_isReactive',
	IS_READONLY = '__v_isReadonly'
}

function createReactiveObject(raw, baseHandlers) {
	if (!isObject(raw)) {
		console.warn('target is not a object', raw)
		return raw
	}
	return new Proxy(raw, baseHandlers)
}

export function reactive(raw) {
	return createReactiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
	return createReactiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw) {
	return createReactiveObject(raw, shallowReadonlyHandlers)
}

export function isReactive(raw) {
	return !!raw[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(raw) {
	return !!raw[ReactiveFlags.IS_READONLY]
}

export function isProxy(raw) {
	return isReactive(raw) || isReadonly(raw)
}