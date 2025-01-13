import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'], // Configuração para arquivos TypeScript
        languageOptions: {
            parser: typescriptParser, // Parser do TypeScript
            ecmaVersion: 2023,
            sourceType: 'module',
            globals: {
                ...globals.node, // Suporte para variáveis globais do Node.js
            },
        },
        plugins: {
            '@typescript-eslint': typescriptPlugin, // Plugin para TypeScript
        },
        rules: {
            // Regras gerais
            'constructor-super': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'semi': ['error', 'always'],
            'curly': ['error', 'all'],
            'quotes': ['warn', 'single'],
            'indent': ['error', 2],
            'no-var': ['error'],
            'prefer-const': ['warn'],
            'arrow-parens': ['error', 'always'],
            'object-curly-spacing': ['warn', 'always'],
            'no-debugger': ['error'],
            'eqeqeq': ['error', 'always'],
            'no-unused-vars': 'off', // Desativado para evitar conflito com TypeScript
            '@typescript-eslint/no-unused-vars': ['error'], // Regra para TypeScript

            // Regras específicas para TypeScript
            '@typescript-eslint/explicit-function-return-type': ['warn'], // Exige tipo de retorno explícito
            '@typescript-eslint/no-explicit-any': ['warn'], // Desencoraja o uso de 'any'
            '@typescript-eslint/consistent-type-definitions': ['error', 'interface'], // Prefere interfaces sobre types
            '@typescript-eslint/no-non-null-assertion': 'warn', // Evita uso do operador "!" (não-nulo)

            // Regras específicas para Node.js
            'no-process-exit': 'error', // Evita uso de process.exit()
            'no-buffer-constructor': 'error', // Evita uso obsoleto do Buffer
            'callback-return': 'warn', // Garante retorno em callbacks
        },
    },
    {
        files: ['*.config.ts'], // Configuração para arquivos de configuração
        languageOptions: {
            globals: {
                module: 'readonly',
                process: 'readonly',
            },
        },
        rules: {
            '@typescript-eslint/no-var-requires': 'off', // Permite uso de require em arquivos de configuração
        },
    },
];
