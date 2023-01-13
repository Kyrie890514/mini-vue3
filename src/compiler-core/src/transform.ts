export function transform(root, options = {}) {
	const context = createTransformContext(root, options)
	traverseNode(root, context)
	createRootCodegen(root)
}

function traverseNode(node: any, context: any) {
	for (const transform of context.nodeTransforms) {
		transform(node)
	}
	traverseChildren(node, context)
}

function traverseChildren(node: any, context: any) {
	const children = node.children
	if (children && children.length) {
		for (const child of children) {
			traverseNode(child, context)
		}
	}
}

function createTransformContext(root: any, options: any) {
	const context = {
		root,
		nodeTransforms: options.nodeTransforms || []
	}
	return context
}

function createRootCodegen(root: any) {
	root.codegenNode = root.children[0]
}
