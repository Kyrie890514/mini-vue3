import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"
import { transformExpression } from "../src/transforms/transformsExpression"

describe('codegen', () => {
	it('string', () => {
		const ast = baseParse('Kyrie890514')
		transform(ast)
		const { code } = generate(ast)
		expect(code).toMatchSnapshot()
	})
	it('interpolation', () => {
		const ast = baseParse('{{message}}')
		transform(ast, {
			nodeTransforms: [transformExpression]
		})
		const { code } = generate(ast)
		expect(code).toMatchSnapshot()
	})
})