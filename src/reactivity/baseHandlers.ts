import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"
import { isObject } from "../shared"

function createGetter(isReadonly = false) {
	return function get(target, key) {
		if (key === ReactiveFlags.IS_REACTIVE) {
			return !isReadonly
		} else if (key === ReactiveFlags.IS_READONLY) {
			return isReadonly
		}
		const res = Reflect.get(target, key)
		if (isObject(res)) {
			return isReadonly ? readonly(res) : reactive(res)
		}
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