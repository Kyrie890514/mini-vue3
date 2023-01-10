export const extend = Object.assign

export const isObject = (raw) => {
	return raw !== null && typeof raw === 'object'
}