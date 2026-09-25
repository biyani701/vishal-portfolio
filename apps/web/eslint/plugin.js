import noArbitraryTailwind from './rules/no-arbitrary-tailwind.js'
import noAsChild from './rules/no-as-child.js'

export default {
  meta: { name: 'eslint-plugin-portfolio' },
  rules: {
    'no-arbitrary-tailwind': noArbitraryTailwind,
    'no-as-child': noAsChild,
  },
}
