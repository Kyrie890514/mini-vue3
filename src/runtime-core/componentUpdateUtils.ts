export function shouldUpdateComponent(newVnode, oldVnode) {
	const { props: oldProps } = oldVnode
	const { props: newProps } = newVnode
	for (const key in newProps) {
		if (newProps[key] !== oldProps[key]) {
			return true
		}
	}
	return false
}