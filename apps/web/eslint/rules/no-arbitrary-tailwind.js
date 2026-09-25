// UF-3 / design package §4: styling uses Programme tokens only, so arbitrary Tailwind values
// (`p-[13px]`, `text-[#2447D9]`, `[mask-type:alpha]`, `p-(--gap)`) are banned outside src/design and src/ui.
// Arbitrary variants such as `data-[state=open]:` are left alone; only the utility itself is checked.

const CLASS_ATTRIBUTES = new Set(['className', 'class'])
const CLASS_FUNCTIONS = new Set(['cn', 'clsx', 'cx', 'cva', 'twMerge', 'tv'])

/** Returns the utility part of a class token, i.e. everything after the last top-level `:`. */
function utilityOf(token) {
  let depth = 0
  let start = 0
  for (let i = 0; i < token.length; i++) {
    const ch = token[i]
    if (ch === '[' || ch === '(') depth++
    else if (ch === ']' || ch === ')') depth--
    else if (ch === ':' && depth === 0) start = i + 1
  }
  return token.slice(start)
}

function isArbitrary(token) {
  const utility = utilityOf(token).replace(/^!/, '')
  return utility.startsWith('[') || /-\[.+\]/.test(utility) || /-\(.+\)/.test(utility)
}

function isClassContext(ancestors) {
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const node = ancestors[i]
    if (node.type === 'JSXAttribute') {
      return node.name.type === 'JSXIdentifier' && CLASS_ATTRIBUTES.has(node.name.name)
    }
    if (node.type === 'CallExpression') {
      const { callee } = node
      if (callee.type === 'Identifier' && CLASS_FUNCTIONS.has(callee.name)) return true
    }
  }
  return false
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow arbitrary Tailwind values outside src/design and src/ui' },
    schema: [],
    messages: {
      arbitrary:
        'Arbitrary Tailwind value `{{token}}`. Use a Programme token (src/design) or a src/ui component variant.',
    },
  },
  create(context) {
    function check(node, text) {
      if (!isClassContext(context.sourceCode.getAncestors(node))) return
      for (const token of text.split(/\s+/)) {
        if (token && isArbitrary(token)) context.report({ node, messageId: 'arbitrary', data: { token } })
      }
    }
    return {
      Literal(node) {
        if (typeof node.value === 'string') check(node, node.value)
      },
      TemplateElement(node) {
        check(node, node.value.cooked ?? node.value.raw)
      },
    }
  },
}
