// These rules are merged into the out of box rules coming from tsdx - https://github.com/formium/tsdx/blob/master/src/createEslintConfig.ts
module.exports = {
  rules: {
    complexity: ['error', 8], // if a component/function is getting too complex it should be broken down
    curly: ['error', 'all'], // use curly brace even for single line functions
    'comma-dangle': ['error', 'always-multiline'], // easier to see git diff
    'prefer-template': ['error'], // easier to read code when variables are used
    'react/prefer-stateless-function': ['error'], // functional components are better
    'prettier/prettier': 'error',
  },
};
