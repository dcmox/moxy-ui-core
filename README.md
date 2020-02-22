# moxy-ui-core

Core functions for the UI.

## Example Use

```typescript
const {
	bindAll,
	elem,
	getTextWidth,
	query,
	queryAll,
	svge,
} = require('moxy-ui-core')

// Bind all inputs
bindAll('input', (el: any) => {
	el.onchange = () => {
		console.log('Input changed!')
	}
})

// Bind all form inputs
const form = query('#register')
bindAll(form)('input', (el: any) => {
	el.onchange = () => {
		console.log('Form input changed!')
	}
})

// Create an element
const el = elem('div', {
	class: 'test',
	id: 'testId',
	style: 'background-color: #eee',
})

// Get width of text
const width = getTextWidth('This is a test', 'Verdana', '11px')

// Query an element
const form = query('#register')
const firstInput = query(form)('input:nth-child(1)')

// Query all
const inputs = queryAll('form input')
inputs.forEach((input: any) => {
	// do work
})

// Create SVG element
const svg = svge('circle', {
	cx: 100,
	cy: 100,
	r: 50,
	stroke: 'green',
})
```
