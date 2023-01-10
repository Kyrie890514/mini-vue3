import { extend } from "../shared"

const targetMap = new Map()

let activeEffect
let shouldTrack = false

export function track(target, key) {
	if (isTracking()) {
		let depsMap = targetMap.get(target)
		if (!depsMap) {
			depsMap = new Map()
			targetMap.set(target, depsMap)
		}
		let dep = depsMap.get(key)
		if (!dep) {
			dep = new Set()
			depsMap.set(key, dep)
		}
		trackEffects(dep)
	}
}

export function trackEffects(dep) {
	if (dep.has(activeEffect)) {
		return
	}
	dep.add(activeEffect)
	activeEffect.deps.push(dep)
}

export function isTracking() {
	return !!(shouldTrack && activeEffect)
}

export function trigger(target, key) {
	let depsMap = targetMap.get(target)
	if (!depsMap) return
	let dep = depsMap.get(key)
	triggerEffects(dep)
}

export function triggerEffects(dep) {
	for (const effect of dep) {
		if (effect.scheduler) {
			effect.scheduler()
		} else {
			effect.run()
		}
	}
}

export class ReactiveEffect {
	private _fn: any
	deps = []
	active = true
	onStop?: () => void
	constructor(fn, public scheduler?) {
		this._fn = fn
	}
	run() {
		if (!this.active) {
			return this._fn()
		}
		activeEffect = this
		shouldTrack = true
		const result = this._fn()
		shouldTrack = false
		return result
	}
	stop() {
		if (this.active) {
			cleanUpEffect(this)
			this.onStop?.()
			this.active = false
		}
	}
}

function cleanUpEffect(effect) {
	effect.deps.forEach((dep: any) => {
		dep.delete(effect)
	})
	effect.deps.length = 0
}

export function effect(fn, options: any = {}) {
	const _effect = new ReactiveEffect(fn, options.scheduler)
	extend(_effect, options)
	_effect.run()
	const runner: any = _effect.run.bind(_effect)
	runner.effect = _effect
	return runner
}

export function stop(runner) {
	runner.effect.stop()
}