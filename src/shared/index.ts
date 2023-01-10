export const extend = Object.assign

export const isObject = (raw) => {
	return raw !== null && typeof raw === 'object'
}

export const hasChanged = (oldValue, newValue) => !Object.is(oldValue, newValue)