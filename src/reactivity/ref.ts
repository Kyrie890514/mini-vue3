import { hasChanged, isObject } from "../shared"
import { isTracking, trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"

class RefImpl {
	public dep
	public __v_isRef = true
	private _value: any
	private _rawValue: any
	constructor(value) {
		this._rawValue = value
		this._value = convert(value)
		this.dep = new Set()
	}
	get value() {
		trackRefValue(this)
		return this._value
	}
	set value(newValue) {
		if (hasChanged(this._rawValue, newValue)) {
			this._rawValue = newValue
			this._value = convert(newValue)
			triggerEffects(this.dep)
		}
	}
}

function trackRefValue(ref) {
	isTracking() && trackEffects(ref.dep)
}

function convert(value) {
	return isObject(value) ? reactive(value) : value
}

export function ref(value) {
	return new RefImpl(value)
}

export function isRef(value) {
	return !!value.__v_isRef
}

export function unRef(ref) {
	return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRefs) {
	return new Proxy(objectWithRefs, {
		get(target, key) {
			return unRef(Reflect.get(target, key))
		},
		set(target, key, newValue) {
			if (isRef(target[key]) && !isRef(newValue)) {
				return (target[key].value = newValue)
			} else {
				return Reflect.set(target, key, newValue)
			}
		}
	})
}