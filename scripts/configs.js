const {readFileSync, readdirSync} = require('fs');
const path = require('path');

const esbuild = require('esbuild');

const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

const {nodeModulesPolyfillPlugin} = require('esbuild-plugins-node-modules-polyfill');
const {sassPlugin} = require('esbuild-sass-plugin');

const configuredSassPlugin = sassPlugin({
  cssImports: true,
  async transform(source, resolve, filepath) {
    source = source.replace(/(?:^@import\s(?:'|")@(.+)(?:'|");)/gimu, (_, group) => {
      const css = readFileSync(path.join('node_modules', '@' + group), 'utf8').replace(
        /@charset[^;]*;/g,
        '',
      );

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

const configuredNodePolyfillPlugin = nodeModulesPolyfillPlugin({
  globals: {process: true, Buffer: true},
});

// page-constructor 8.x publishes only a webpack chunk as widget/index.js.
// Bundle the iframe entry locally; Editor copies the host styles into its iframe.
const pageConstructorCompatibilityPlugin = {
  name: 'page-constructor-compatibility',
  setup(build) {
    // The published enum includes blocks for which no editor template is shipped.
    build.onLoad(
      {filter: /page-constructor\/build\/esm\/editor\/data\/index\.js$/},
      ({path: filename}) => {
        const source = readFileSync(filename, 'utf8');
        const templateDir = path.join(path.dirname(filename), 'templates');
        const blocks = readdirSync(templateDir)
          .filter((file) => file.endsWith('.json'))
          .map((file) => file.slice(0, -5));
        const loop = 'Object.values(BlockType)';
        if (!source.includes(loop)) {
          throw new Error(
            'Page Constructor template loader changed; review the compatibility plugin',
          );
        }
        return {
          contents: source.replace(
            loop,
            `${loop}.filter((type) => ${JSON.stringify(blocks)}.includes(type))`,
          ),
          loader: 'js',
          resolveDir: path.dirname(filename),
          watchFiles: [filename],
          watchDirs: [templateDir],
        };
      },
    );
    const entry = path.resolve(__dirname, '../src/PageConstructorEditor/widget.tsx');
    build.onResolve({filter: /^widget$/}, () => ({path: entry, namespace: 'pc-widget'}));
    build.onLoad({filter: /.*/, namespace: 'pc-widget'}, async () => {
      const result = await esbuild.build({
        entryPoints: [entry],
        write: false,
        bundle: true,
        minify: true,
        platform: 'browser',
        format: 'iife',
        jsx: 'automatic',
        loader: {'.css': 'empty', '.scss': 'empty'},
        plugins: [nodeModulesPolyfillPlugin({globals: {process: true, Buffer: true}})],
      });
      return {
        contents: `export default ${JSON.stringify(result.outputFiles[0].text)};`,
        loader: 'js',
        watchFiles: [entry],
      };
    });
  },
};

const common = {
  platform: 'browser',
  sourcemap: true,
  minify: false,
  bundle: true,
};

const ts = ({entryPoints, outfile, outdir} = {}) => {
  const config = {
    ...common,
    plugins: [
      pageConstructorCompatibilityPlugin,
      configuredNodePolyfillPlugin,
      configuredSassPlugin,
    ],
    jsx: 'automatic',
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
