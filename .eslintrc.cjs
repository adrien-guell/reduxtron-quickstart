module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:import/typescript',
        '@electron-toolkit/eslint-config-ts/recommended',
        '@electron-toolkit/eslint-config-prettier',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    plugins: ['@typescript-eslint'],
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off'
    }
};
