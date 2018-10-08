const path = require('path');
const r = m => require.resolve(m);

function preset() {
  const root = path.join(__dirname, './');
  const sourcePaths = [root];
  return {
    presets: [r('babel-preset-react-native-stage-0/decorator-support')],
    plugins: [
      [
        r('babel-plugin-module-resolver'),
        {
          root: sourcePaths,
          alias: {
            src: `${root}src`,
          },
          extensions: ['.js', '.ios.js', '.android.js'],
        },
      ],
    ],
  };
}

module.exports = preset;
