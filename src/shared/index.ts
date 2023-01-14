export const extend = Object.assign

export const isObject = (raw) => {
	return raw !== null && typeof raw === 'object'
}

export const isString = val => typeof val === 'string'

export const hasChanged = (oldValue, newValue) => !Object.is(oldValue, newValue)

export const isOn = (key: string) => /^on[A-Z]/.test(key)

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

export const camelize = (str: string) => {
	return str.replace(/-(\w)/, (_, c: string) => {
		return c ? c.toUpperCase() : ''
	})
}

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const toHandlerKey = (str: string) => {
	str = camelize(str)
	return str ? 'on' + capitalize(str) : ''
}

export const EMPTY_OBJ = {}