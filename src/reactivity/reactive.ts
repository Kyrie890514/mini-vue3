import { mutableHandlers, readonlyHandlers } from "./baseHandlers"

function createReactiveObject(raw, baseHandlers) {
	return new Proxy(raw, baseHandlers)
}

export function reactive(raw) {
	return createReactiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
	return createReactiveObject(raw, readonlyHandlers)
}