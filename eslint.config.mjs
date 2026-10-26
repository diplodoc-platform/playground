import baseConfig from '@gravity-ui/eslint-config';
import prettierConfig from '@gravity-ui/eslint-config/prettier';

export default [
  {ignores: ['node_modules/**', 'www/**', 'docs/**', 'bundle/**']},
  ...baseConfig,
  ...prettierConfig,
  {files: ['src/index.html.js', 'scripts/*.js'], languageOptions: {sourceType: 'commonjs'}},
];
