export const enum NodeTypes {
	INTERPOLATION,
	SIMPLE_EXPRESSION,
	ELEMENT,
	TEXT,
	ROOT,
	COMPOUND_EXPRESSION
}

export function createVnodeCall(tag, porps, children) {
	return {
		type: NodeTypes.ELEMENT,
		tag,
		porps,
		children
	}
}