import { createRenderer } from '../runtime-core'
import { isOn } from '../shared'

export function createElement(type) {
	return document.createElement(type)
}

export function createTextNode(text) {
	return document.createTextNode(text)
}

export function patchProp(el, key, val) {
	if (isOn(key)) {
		const event = key.slice(2).toLowerCase()
		el.addEventListener(event, val)
	} else {
		el.setAttribute(key, val)
	}
}

export function insert(el, parent) {
	parent.append(el)
}

const renderer: any = createRenderer({
	createElement, patchProp, insert, createTextNode
})

export function createApp(...args) {
	return renderer.createApp(...args)
}

export * from '../runtime-core'