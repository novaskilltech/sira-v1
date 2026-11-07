import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['node_modules/**', 'dist/**', 'public/**', '**/generated/**', '.npm-cache/**', 'reports/**', 'playwright-report/**', 'test-results/**', '.vercel/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    languageOptions: {
      globals: Object.fromEntries([
        'console', 'process', 'Buffer', 'URL', 'TextEncoder', 'TextDecoder', 'fetch',
        'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
        'document', 'window', 'navigator', 'localStorage', 'sessionStorage',
        'Audio', 'Event', 'CustomEvent', 'DOMException', 'Storage', 'structuredClone',
      ].map(name => [name, 'readonly'])),
    },
    rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }] },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // TypeScript checks symbol resolution, including DOM and generic type names.
      'no-undef': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
);
