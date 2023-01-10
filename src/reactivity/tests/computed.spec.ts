import { computed } from "../computed"
import { reactive } from "../reactive"

describe('computed', () => {
	it('happy path', () => {
		const user = reactive({ age: 11 })
		const age = computed(() => user.age)
		expect(age.value).toBe(11)
	})

	it('should comuted lazily', () => {
		const value = reactive({ foo: 1 })
		const getter = jest.fn(() => value.foo)
		const cValue = computed(getter)
		expect(getter).not.toHaveBeenCalled()
		expect(cValue.value).toBe(1)
		expect(getter).toHaveBeenCalledTimes(1)
		cValue.value
		expect(getter).toHaveBeenCalledTimes(1)
		value.foo++
		expect(getter).toHaveBeenCalledTimes(1)
		expect(cValue.value).toBe(2)
		expect(getter).toHaveBeenCalledTimes(2)
		cValue.value
		expect(getter).toHaveBeenCalledTimes(2)
	})
})