import { createRenderer } from '../runtime-core'
import { isOn } from '../shared'

export function createElement(type) {
	return document.createElement(type)
}

export function createTextNode(text) {
	return document.createTextNode(text)
}

export function patchProp(el, key, oldVal, newVal) {
	if (isOn(key)) {
		const event = key.slice(2).toLowerCase()
		el.addEventListener(event, newVal)
	} else {
		if (newVal !== undefined && newVal !== null) {
			el.setAttribute(key, newVal)
		} else {
			el.removeAttribute(key)
		}
	}
}

export function insert(child, parent, anchor) {
	parent.insertBefore(child, anchor || null)
}

export function remove(el) {
	const parent = el.parentNode
	if (parent) {
		parent.removeChild(el)
	}
}

export function setElementText(el, text) {
	el.textContent = text
}

const renderer: any = createRenderer({
	createElement, patchProp, insert, createTextNode, remove, setElementText
})

export function createApp(...args) {
	return renderer.createApp(...args)
}

export * from '../runtime-core'