module.exports = {
  extends: ['react-app', 'prettier/@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
