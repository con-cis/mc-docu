// @ts-check
import type { Linter } from 'eslint'

import typescriptEslint from '@typescript-eslint/eslint-plugin'
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import vuePlugin from 'eslint-plugin-vue'
import globals from 'globals'
import url from 'node:url'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// const config: Linter.Config[] = [
//   {
//     ignores: ['node_modules', 'dist/**/*', 'out/**/*'], // Add any ignored patterns here
//     files: ['**/*.{js,ts,vue}'], // Specify the file types this configuration applies to
//     languageOptions: {
//       parser: vueParser, // Use Vue ESLint parser
//       parserOptions: {
//         parser: '@typescript-eslint/parser', // Use TypeScript parser within Vue
//         ecmaVersion: 'latest', // Enable modern ECMAScript features
//         sourceType: 'module' // Allow ES modules
//       },
//       globals: {
//         ...globals.browser,
//         ...globals.node
//       }
//     } as Linter.LanguageOptions,
//     plugins: {
//       ['@typescript-eslint']: tseslint.plugin,
//       vue: vuePlugin
//     },
//     linterOptions: {
//       reportUnusedDisableDirectives: 'off'
//     },

//     // ...tseslint.configs.recommendedTypeChecked,
//     rules: {
//       // Include the rules from vue3-recommended directly
//       ...typescriptEslint.configs['eslint-recommended'].rules,
//       ...vuePlugin.configs['vue3-recommended'].rules,
//       // Custom rules
//       '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
//       '@typescript-eslint/explicit-function-return-type': 'warn',
//       '@typescript-eslint/explicit-module-boundary-types': 'off',
//       '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
//       '@typescript-eslint/no-explicit-any': 'error',
//       '@typescript-eslint/no-non-null-assertion': 'off',
//       '@typescript-eslint/no-var-requires': 'off',
//       'vue/multi-word-component-names': 'off' // Example of a Vue-specific rule
//     } as Linter.RulesRecord
//   },
//   {
//     files: ['*.js'], // Override rules specifically for JavaScript files
//     rules: {
//       '@typescript-eslint/explicit-function-return-type': 'off'
//     }
//   },
//   ...(tseslint.configs.recommendedTypeChecked as Linter.Config[]),
//   {
//     languageOptions: {
//       parserOptions: {
//         projectService: {
//           allowDefaultProject: ['*.ts']
//         },
//         tsconfigRootDir: import.meta.dirname,
//         allowDefaultProject: true
//       }
//     }
//   }
// ]

// export default config

export default tseslint.config(
  // register all of the plugins up-front
  {
    // note - intentionally uses computed syntax to make it easy to sort the keys
    plugins: {
      ['@typescript-eslint']: tseslint.plugin,
      ['@typescript-eslint/eslint-plugin']: typescriptEslint,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ['perfectionist']: perfectionistPlugin,
      vue: vuePlugin,
    },
    settings: {
      perfectionist: {
        order: 'asc',
        partitionByComment: true,
        type: 'natural'
      }
    }
  },
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', 'out/**/*', '**/*.mjs', '**/*.js'], // Add any ignored patterns here
  },
  vuePlugin.configs['flat/recommended'],
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  // base config
  {
    languageOptions: {
      globals: {
        ...globals.es2020,
        ...globals.node,
        ...globals.browser
      },
      parser: vueParser, // Use Vue ESLint parser
      parserOptions: {
        allowDefaultProject: true,
        extraFileExtensions: ['.vue'],
        parser: '@typescript-eslint/parser', // Use TypeScript parser within Vue
        projectService: true,
        tsconfigRootDir: __dirname,
        warnOnUnsupportedTypeScriptVersion: false
      },
    },
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    rules: {
      // Include the rules from vue3-recommended directly
      ...vuePlugin.configs['vue3-recommended'].rules,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...perfectionistPlugin.configs['recommended-alphabetical'].rules,
      // Custom rules
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off'
    } as Linter.RulesRecord,
    settings: {
      perfectionist: {
        order: 'asc',
        partitionByComment: true,
        type: 'natural',
      },
    }
  }
)
