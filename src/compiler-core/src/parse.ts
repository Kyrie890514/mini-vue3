import { NodeTypes } from "./ast"

const enum TagType {
	Start,
	End
}

export function baseParse(content: string) {
	const context = createParserContext(content)
	return createRoot(parseChildren(context, []))
}

function parseChildren(context, ancestors) {
	const nodes: any[] = []
	while (!isEnd(context, ancestors)) {
		let node
		const q = context.source
		if (q.startsWith('{{')) {
			node = parseInterpolation(context)
		} else if (q[0] === '<') {
			if (/[a-z]/i.test(q[1])) {
				node = parseElement(context, ancestors)
			}
		}
		if (!node) {
			node = parserText(context)
		}
		nodes.push(node)
	}
	return nodes
}

function isEnd(context, ancestors) {
	const s = context.source
	if (s.startsWith('</')) {
		for (let i = ancestors.length - 1; i >= 0; i--) {
			const tag = ancestors[i].tag
			if (startsWithEndTagOpen(s, tag)) {
				return true
			}
		}
	}
	return !s
}

function parserText(context: any) {
	const endTokens = ['{{', '<']
	let endIndex = context.source.length
	for (const token of endTokens) {
		const index = context.source.indexOf(token)
		if (index !== -1 && index < endIndex) {
			endIndex = index
		}
	}
	const content = parseTextData(context, endIndex)
	return {
		type: NodeTypes.TEXT,
		content
	}
}

function parseTextData(context: any, length) {
	const content = context.source.slice(0, length)
	advanceBy(context, content.length)
	return content
}

function parseElement(context: any, ancestors) {
	const element: any = parseTag(context, TagType.Start)
	ancestors.push(element)
	element.children = parseChildren(context, ancestors)
	ancestors.pop()
	if (startsWithEndTagOpen(context.source, element.tag)) {
		parseTag(context, TagType.End)
	} else {
		throw new Error(`lack end tag ${element.tag}`)
	}
	return element
}

function startsWithEndTagOpen(source, tag) {
	return source.startsWith('</') && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
}

function parseTag(context: any, type) {
	const match: any = /^<\/?([a-z]*)/i.exec(context.source)
	const tag = match[1]
	advanceBy(context, match[0].length)
	advanceBy(context, 1)
	if (type === TagType.End) return
	return {
		type: NodeTypes.ELEMENT,
		tag
	}
}

function parseInterpolation(context) {
	const openDelimiter = '{{'
	const closeDelimiter = '}}'
	const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)
	advanceBy(context, openDelimiter.length)
	const rawContentLength = closeIndex - openDelimiter.length
	const rawContent = parseTextData(context, rawContentLength)
	advanceBy(context, closeDelimiter.length)
	const content = rawContent.trim()

	return {
		type: NodeTypes.INTERPOLATION,
		content: {
			type: NodeTypes.SIMPLE_EXPRESSION,
			content
		}
	}
}

function advanceBy(context: any, length: number) {
	context.source = context.source.slice(length)
}

function createRoot(children) {
	return {
		children
	}
}

function createParserContext(content: string) {
	return {
		source: content
	}
}