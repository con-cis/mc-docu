import vueParser from 'vue-eslint-parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import vuePlugin from 'eslint-plugin-vue'

export default [
  {
    ignores: ['node_modules', 'dist/**/*', 'out/**/*'], // Add any ignored patterns here
    files: ['**/*.{js,ts,vue}'], // Specify the file types this configuration applies to
    languageOptions: {
      parser: vueParser, // Use Vue ESLint parser
      parserOptions: {
        parser: '@typescript-eslint/parser', // Use TypeScript parser within Vue
        ecmaVersion: 2021, // Enable modern ECMAScript features
        sourceType: 'module' // Allow ES modules
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      vue: vuePlugin
    },
    rules: {
      // Include the rules from vue3-recommended directly
      ...vuePlugin.configs['vue3-recommended'].rules,
      // Custom rules
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'vue/multi-word-component-names': 'off' // Example of a Vue-specific rule
    }
  },
  {
    files: ['*.js'], // Override rules specifically for JavaScript files
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  }
]
