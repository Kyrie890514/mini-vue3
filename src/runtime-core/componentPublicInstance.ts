import { hasOwn } from "../shared/index"

const publicPropertiesMap = {
	$el: (i: any) => i.vnode.el,
	$slots: (i: any) => i.slots,
	$props: (i: any) => i.props
}

export const publicInstanceProxyHandlers = {
	get({ _: instance }, key) {
		const { setupState, props } = instance
		if (hasOwn(setupState, key)) {
			return setupState[key]
		} else if (hasOwn(props, key)) {
			return props[key]
		}
		const publicGetter = publicPropertiesMap[key]
		if (publicGetter) {
			return publicGetter(instance)
		}
	}
}