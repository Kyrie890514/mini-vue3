import { extend } from "../shared"

const targetMap = new Map()

let activeEffect

export function track(target, key) {
	if (activeEffect) {
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
		dep.add(activeEffect)
		activeEffect.deps.push(dep)
	}
}

export function trigger(target, key) {
	let depsMap = targetMap.get(target)
	let dep = depsMap.get(key)
	for (const effect of dep) {
		if (effect.scheduler) {
			effect.scheduler()
		} else {
			effect.run()
		}
	}
}

class ReactiveEffect {
	private _fn: any
	deps = []
	active = true
	onStop?: () => void
	constructor(fn, public scheduler?) {
		this._fn = fn
	}
	run() {
		activeEffect = this
		return this._fn()
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