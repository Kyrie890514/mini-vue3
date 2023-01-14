import { NodeTypes } from "./ast"
import { TO_DISPLAY_STRING } from "./runtimeHelper"

export function transform(root, options = {}) {
	const context = createTransformContext(root, options)
	traverseNode(root, context)
	createRootCodegen(root)
	root.helpers = [...context.helpers.keys()]
}

function traverseNode(node: any, context: any) {
	const exitFns: any = []
	for (const transform of context.nodeTransforms) {
		const onExit = transform(node, context)
		onExit && exitFns.push(onExit)
	}
	switch (node.type) {
		case NodeTypes.INTERPOLATION:
			context.helper(TO_DISPLAY_STRING)
			break
		case NodeTypes.ROOT:
		case NodeTypes.ELEMENT:
			traverseChildren(node, context)
			break
	}
	let i = exitFns.length
	while (i--) {
		exitFns[i]()
	}
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
		nodeTransforms: options.nodeTransforms || [],
		helper(key) {
			context.helpers.set(key, 1)
		},
		helpers: new Map()
	}
	return context
}

function createRootCodegen(root: any) {
	const child = root.children[0]
	if (child.type === NodeTypes.ELEMENT) {
		root.codegenNode = child.codegenNode
	} else {
		root.codegenNode = root.children[0]
	}
}