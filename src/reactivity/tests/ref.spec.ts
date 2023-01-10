import { effect } from "../effect";
import { reactive } from "../reactive";
import { ref, isRef, unRef, proxyRefs } from "../ref";

describe('ref', () => {
	it("happy path", () => {
		const a = ref(1)
		expect(a.value).toBe(1)
	})

	it('shoule be reactive', () => {
		const a = ref(1)
		let dummy
		let calls = 0
		effect(() => {
			calls++
			dummy = a.value
		})
		expect(calls).toBe(1)
		expect(dummy).toBe(1)
		a.value = 2
		expect(calls).toBe(2)
		expect(dummy).toBe(2)
		a.value = 2
		expect(calls).toBe(2)
		expect(dummy).toBe(2)
	})

	it('should make nested properties reactive', () => {
		const a = ref({ count: 1 })
		let dummy
		effect(() => {
			dummy = a.value.count
		})
		expect(dummy).toBe(1)
		a.value.count = 2
		expect(dummy).toBe(2)
	})

	it('isRef', () => {
		const a = ref(1)
		const b = reactive({})
		expect(isRef(a)).toBe(true)
		expect(isRef(b)).toBe(false)
		expect(isRef(1)).toBe(false)
	})

	it('unRef', () => {
		const a = ref(1)
		expect(unRef(a)).toBe(1)
		expect(unRef(1)).toBe(1)
	})

	it('proxyRefs', () => {
		const user = {
			age: ref(11),
			name: 'Kyrie'
		}
		const proxyUser = proxyRefs(user)
		expect(user.age.value).toBe(11)
		expect(proxyUser.age).toBe(11)
		expect(proxyUser.name).toBe('Kyrie')
		proxyUser.age = 2
		expect(proxyUser.age).toBe(2)
		expect(user.age.value).toBe(2)
		proxyUser.age = ref(21)
		expect(proxyUser.age).toBe(21)
		expect(user.age.value).toBe(21)
	})
})