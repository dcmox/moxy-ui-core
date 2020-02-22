export interface IKeyValuePair {
	[key: string]: any
}

type TSVGElement =
	| 'svg'
	| 'g'
	| 'circle'
	| 'text'
	| 'path'
	| 'line'
	| 'polyline'

export const query = (selector: string | HTMLElement): any => {
	if (typeof selector !== 'string') {
		return (sel: string) => {
			return selector.querySelector(sel) || {}
		}
	} else {
		return document.querySelector(selector) || {}
	}
}

export const getTextWidth = (text: string, font: string, fontSize: string) => {
	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')
	if (context) {
		context.font = fontSize + ' ' + font
		const metrics = context.measureText(text)
		return metrics.width
	}
	return -1
}

export const queryAll = (
	selector: string | HTMLElement,
	proxy: boolean = false,
) => {
	const elements: any = []
	if (typeof selector !== 'string') {
		return (sel: string) => {
			selector
				.querySelectorAll(sel)
				.forEach((el: Element) => elements.push(el))
			if (proxy) {
				return new Proxy({ elements }, queryHandler)
			}
			return elements
		}
	}
	document
		.querySelectorAll(selector)
		.forEach((el: Element) => elements.push(el))
	if (proxy) {
		return new Proxy({ elements }, queryHandler)
	}
	return elements
}

export const bindAll = (
	selector: HTMLElement | string,
	fn?: (el: HTMLElement) => any,
): any => {
	if (typeof selector !== 'string') {
		return (sel: string, fnn: (el: HTMLElement) => any) => {
			selector.querySelectorAll(sel).forEach((el: any) => {
				fnn(el)
			})
		}
	} else if (fn) {
		document.querySelectorAll(selector).forEach((el: any) => {
			fn(el)
		})
	}
}

const queryMethods: any = {
	remove(el: HTMLElement): void {
		el.remove()
	},
	hide(el: HTMLElement): void {
		el.style.display = 'none'
	},
	show(el: HTMLElement): void {
		el.style.display = 'block'
		el.style.opacity = '1'
	},
	append(el: HTMLElement, ...children: any): void {
		el.append(...children)
	},
	removeClass(el: HTMLElement, cls: string): void {
		el.classList.remove(cls)
	},
	addClass(el: HTMLElement, cls: string): void {
		el.classList.add(cls)
	},
	attr(el: HTMLElement, attr: string, value: string): void {
		el.setAttribute(attr, value)
	},
	removeAttr(el: HTMLElement, attr: string): void {
		el.removeAttribute(attr)
	},
	removeProp(el: HTMLElement, prop: string): void {
		el.style.removeProperty(prop)
	},
	prop(el: HTMLElement, prop: string, value: string): void {
		el.style.setProperty(prop, value)
	},
}

const queryHandler = {
	get: (target: any, keyOrMethod: string) => {
		if (target.elements.length === 0) {
			return (...args: any) => []
		} else if (
			typeof target.elements[0][keyOrMethod] !== 'function' &&
			!queryMethods[keyOrMethod]
		) {
			return target.elements.map((el: any) => el[keyOrMethod])
		}
		return (...args: any) => {
			const result: any = []
			target.elements.forEach((el: any) => {
				if (el[keyOrMethod]) {
					el[keyOrMethod](...args)
				} else if (queryMethods[keyOrMethod]) {
					result.push(queryMethods[keyOrMethod](el, ...args))
				}
			})
			return result
		}
	},
}

export const elem = (
	type: string,
	attributes?: IKeyValuePair,
	props?: IKeyValuePair,
): any => {
	const elem: any = document.createElement(type)
	if (attributes) {
		Object.keys(attributes).forEach((attr: string) =>
			elem.setAttribute(attr, attributes[attr].toString()),
		)
	}
	if (props) {
		Object.keys(props).forEach(
			(prop: string) => (elem[prop] = props[prop].toString()),
		)
	}
	return elem
}

export const svge = (
	type: TSVGElement,
	attributes?: IKeyValuePair,
	props?: IKeyValuePair,
) => {
	const elem: any = document.createElementNS(
		'http://www.w3.org/2000/svg',
		type,
	)
	if (attributes) {
		Object.keys(attributes).forEach((attr: string) =>
			elem.setAttribute(attr, attributes[attr].toString()),
		)
	}
	if (props) {
		Object.keys(props).forEach(
			(prop: string) => (elem[prop] = props[prop].toString()),
		)
	}
	return elem
}

module.exports = {
	bindAll,
	elem,
	getTextWidth,
	query,
	queryAll,
	svge,
}
