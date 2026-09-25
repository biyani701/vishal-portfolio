// UF-3: Base UI composes with the `render` prop; Radix's `asChild` must not creep back in.
/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow the Radix `asChild` prop; use the Base UI `render` prop' },
    schema: [],
    messages: {
      asChild: '`asChild` is a Radix API. Compose with the Base UI `render` prop instead.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.type === 'JSXIdentifier' && node.name.name === 'asChild') {
          context.report({ node, messageId: 'asChild' })
        }
      },
    }
  },
}
