// //TODO nog te zien in de les
// module.exports = {
//   log: {
//     level: 'silly',
//     disabled: true,
//   },
//   //TODO moet cors hier bij? -> staat niet in de applicatie uit les 5
//   //TODO database toevoegen
// };

module.exports = {
  testEnvironment: 'node',
  testRegex: '(../__tests__/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
};
