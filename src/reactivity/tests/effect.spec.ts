import { reactive } from "../reactive"
import { effect } from "../effect"

describe("effect", () => {
	it("happy path", () => {
		const user = reactive({ age: 10 })
		let age: number
		effect(() => {
			age = user.age + 1
		})
		expect(age!).toBe(11)
		user.age++
		expect(age!).toBe(12)
	})
})