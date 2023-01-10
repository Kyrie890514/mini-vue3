import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"
import { isObject, extend } from "../shared"

function createGetter(isReadonly = false, shallow = false) {
	return function get(target, key) {
		if (key === ReactiveFlags.IS_REACTIVE) {
			return !isReadonly
		} else if (key === ReactiveFlags.IS_READONLY) {
			return isReadonly
		}
		const res = Reflect.get(target, key)
		if (shallow) {
			return res
		}
		if (isObject(res)) {
			return isReadonly ? readonly(res) : reactive(res)
		}
		!isReadonly && track(target, key)
		return res
	}
}

const get = createGetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createSetter() {
	return function set(target, key, value) {
		const res = Reflect.set(target, key, value)
		trigger(target, key)
		return res
	}
}

const set = createSetter()

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

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
	get: shallowReadonlyGet
})