export const extend = Object.assign

export const isObject = (raw) => {
	return raw !== null && typeof raw === 'object'
}

export const hasChanged = (oldValue, newValue) => !Object.is(oldValue, newValue)

export const isOn = (key: string) => /^on[A-Z]/.test(key)

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)
