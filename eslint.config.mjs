import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        languageOptions: { 
            globals: globals.browser,
            parser: tsParser,  // Specify the TypeScript parser
        }
    },
    pluginJs.configs.recommended,
    {
        files: ['*.ts', '*.tsx'],
        languageOptions: {
            parser: tsParser, // Specify the TypeScript parser for TypeScript files
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
    eslintConfigPrettier,
    { ignores: ['dist/', '**/node_modules/**', '**/.yarn/**'] },
];