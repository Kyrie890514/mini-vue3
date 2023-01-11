import { createVnode } from "../vnode";

export function renderSlots(slots, name, props) {
	const slot = slots[name]
	if (slot) {
		if (typeof slot === 'function') {
			return createVnode('div', {}, typeof slot === 'function' ? slot(props) : slot)
		}
		return createVnode('div', {}, slot)
	}
}