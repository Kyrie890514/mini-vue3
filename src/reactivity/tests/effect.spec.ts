import { reactive } from "../reactive"
import { effect } from "../effect"

describe('effect', () => {
	it('happy path', () => {
		const user = reactive({ age: 10 })
		let age: number
		effect(() => {
			age = user.age + 1
		})
		expect(age!).toBe(11)
		user.age++
		expect(age!).toBe(12)
	})

	it('should return runner when call effect', () => {
		let foo = 10
		const runner = effect(() => {
			foo++
			return 'foo'
		})
		expect(foo).toBe(11)
		const r = runner()
		expect(r).toBe('foo')
		expect(foo).toBe(12)
	})

	it('scheduler', () => {
		let dummy
		let run: any
		const scheduler = jest.fn(() => {
			run = runner
		})
		const obj = reactive({ foo: 1 })
		const runner = effect(
			() => {
				dummy = obj.foo
			},
			{ scheduler }
		)
		expect(scheduler).not.toHaveBeenCalled()
		expect(dummy).toBe(1)
		// should be called on first trigger
		obj.foo++
		expect(scheduler).toHaveBeenCalledTimes(1)
		// should not run yet
		expect(dummy).toBe(1)
		// manually run
		run()
		// should have run
		expect(dummy).toBe(2)
	})
})