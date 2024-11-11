import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
    { files: ["src/**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-unused-vars': 'off',
            "no-unused-vars": ["off"],
            'no-var': 'error',
            // 'semi': ['error', 'always'],
            // 'indent': ['error', 4, { SwitchCase: 4 }],
            'no-multi-spaces': 'error',
            'space-in-parens': 'error',
            'no-multiple-empty-lines': 'error',
            'prefer-const': 'error',
        }
    },
    {
        ignores: ["dist/"]
    }
];