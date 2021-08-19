const pug = require('pug')

module.exports = input => {
	const tree = input.split('\n').map(line => line.trimEnd().split('\t').reduce((data, string) => string === '' ? { ...data, indent: data.indent + 1 } : { ...data, text: string }, { indent: 0, text: '' })) // parsed input
	const stack = [] // nodes for closing tags
	const queue = [] // nodes transformed for output
	let skipBelow = Infinity // block text control
	for(const node of tree) {
		// skip empty lines in input
		if(!node.text.length) {
			continue
		}
		// process block text
		if(skipBelow < node.indent) { // duplicate lines within block text
			queue.push(node)
			continue
		}
		skipBelow = node.text.endsWith('.') ? node.indent : Infinity // detect block text start or end
		// close tags for previous nodes if needed
		if(stack.length) {
			while(stack[stack.length - 1].indent > node.indent) { // close deeper tags
				queue.push(stack.pop())
			}
			if(stack[stack.length - 1].indent === node.indent && !node.text.startsWith('{:')) { // close same level tag if current node is not a svelte continuation tag
				queue.push(stack.pop())
			}
		}
		// process svelte logic nodes
		if(node.text.startsWith('{')) {
			queue.push(node)
			if(node.text.startsWith('{#')) { // if node is an opening tag, generate its counterpart closing tag
				stack.push({
					indent: node.indent,
					text: '{/' + node.text.match(/[a-z]+/) + '}'
				})
			}
			continue
		}
		// process all other nodes
		let attrStart = 0 // index of open paren for attributes in node text 
		let attrEnd = 0 // index of close paren for attributes in node text
		const attributes = [] // parsed and formatted attributes
		for(let i = 0; i < node.text.length; i ++) { 
			if(node.text[i] === '(') {
				attrStart = i
				break
			}
			if(node.text[i] === ' ') {
				break
			}
		}
		if(attrStart > 0) {
			let key = '' // attribute key currently being read
			let value = '' // attribute value currently being read
			let finishers = [] // stack of characters we need to find to declare the end of the value
			let i = attrStart
			while(i ++ < node.text.length) {
				if(value) { // check if currently reading value
					value += node.text[i] // copy value char
					if(finishers[finishers.length - 1] === node.text[i]) { // match char against finishers
						finishers.pop()
						if(finishers.length === 0) { // check for end of value
							if(value[0] === '{') {
								attributes.push(key + '!=' + "'" + value.replaceAll("'", "\\'") + "'") // save attribute and quote value
							} else {
								attributes.push(key + '!=' + value) // save attribute
							}
							key = ''
							value = ''
						}
					} else if(finishers[finishers.length - 1] === '}') { // push additional finishers if needed
						if(node.text[i] === '{') {
							finishers.push('}')
						} else if(node.text[i] === "'" || node.text[i] === '"' || node.text[i] === '`') {
							finishers.push(node.text[i])
						}
					}
					continue
				}
				if(node.text[i] === ')') { // check for end of attributes
					attrEnd = i + 1
					if(key) {
						attributes.push(key + "!=''")
					}
					break
				}
				if(node.text[i] === ' ') { // check for end of key
					if(key) {
						attributes.push(key + "!=''")
						key = ''
					}
					continue
				}
				if(node.text[i] === '=') { // check for end of key (with value)
					value = node.text[++ i] // skip ahead 1 character, init value
					finishers.push(value === '{' ? '}' : value)
					continue
				}
				key += node.text[i] // copy key char
			}
		}
		let [openingTag, closingTag] = pug.render(node.text.slice(0, attrStart) + (attributes.length ? '(' + attributes.join(' ') + ')' : '') + node.text.slice(attrEnd, node.text.length)).split('</')
		queue.push({
			indent: node.indent,
			text: openingTag
		})
		if(closingTag) {
			stack.push({
				indent: node.indent,
				text: '</' + closingTag
			})
		}
	}
	// close any remaining closing tags
	while(stack.length > 0) {
		queue.push(stack.pop())
	}
	// format queue nodes and output
	return queue.map(node => '\t'.repeat(node.indent) + node.text).join('\n')
}