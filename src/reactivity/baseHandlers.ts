import { track, trigger } from "./effect"

function createGetter(isReadonly = false) {
	return function get(target, key) {
		const res = Reflect.get(target, key)
		!isReadonly && track(target, key)
		return res
	}
}

function createSetter() {
	return function set(target, key, value) {
		const res = Reflect.set(target, key, value)
		trigger(target, key)
		return res
	}
}

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

export const mutableHandlers = {
	get,
	set
}

export const readonlyHandlers = {
	get: readonlyGet,
	set(target) {
		console.warn('target is readonly', target)
		return true
	}
}