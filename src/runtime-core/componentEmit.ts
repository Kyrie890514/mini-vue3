import { toHandlerKey } from "../shared/index"

export function emit(instance, event, ...args) {
	console.log('emit', event)
	const { props } = instance
	const handler = props[toHandlerKey(event)]
	handler && handler(...args)
}