const {
  readFileSync,
  promises: {readFile},
} = require('fs');
const path = require('path');

const esbuild = require('esbuild');

const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

const polyfillNode = require('esbuild-plugin-polyfill-node').polyfillNode;
const {sassPlugin} = require('esbuild-sass-plugin');

const configuredSassPlugin = sassPlugin({
  cssImports: true,
  async transform(source, resolve, filepath) {
    source = source.replace(/(?:^@import\s(?:'|")@(.+)(?:'|");)/gimu, (_, group) => {
      const css = readFileSync(path.join('node_modules', '@' + group), 'utf8');

      return '\n\n' + css + '\n\n';
    });

    const config = {from: filepath};

    const res = await postcss([
      autoprefixer({cascade: false}),
      postcssPresetEnv({stage: 0}),
    ]).process(source, config);

    return res.css;
  },
});

const configuredNodePolyfillPlugin = polyfillNode();

const common = {
  platform: 'browser',
  sourcemap: true,
  minify: false,
  bundle: true,
};

const ts = ({entryPoints, outfile, outdir} = {}) => {
  const config = {
    ...common,
    plugins: [configuredNodePolyfillPlugin, configuredSassPlugin],
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    entryPoints,
  };

  if (outdir) {
    config.outdir = outdir;
  } else {
    config.outfile = outfile;
  }

  return config;
};

module.exports = {ts};
exports.default = {ts};
