const {
  promises: {writeFile, mkdir, rm},
} = require('fs');
const path = require('path');

const esbuild = require('esbuild');

const configs = require('./configs.js');

const {dependencies, peerDependencies} = require('../package.json');

const external = [
  ...Object.keys(peerDependencies ?? {}),
  ...Object.keys(dependencies ?? {}),
].filter((name) => name !== '@gravity-ui/page-constructor');

// CommonJS dependencies inside Page Constructor must share the ESM consumer's peers.
// Hoist their external requires to imports instead of emitting browser-only dynamic require.
const esmExternalsPlugin = {
  name: 'esm-externals',
  setup(build) {
    build.onResolve({filter: /.*/}, (args) => {
      if (
        args.kind === 'require-call' &&
        external.some((name) => args.path === name || args.path.startsWith(name + '/'))
      ) {
        return {path: args.path, namespace: 'esm-external'};
      }
    });
    build.onLoad({filter: /.*/, namespace: 'esm-external'}, ({path: specifier}) => ({
      contents: `import * as dependency from ${JSON.stringify(specifier)}; module.exports = dependency.default ?? dependency;`,
      loader: 'js',
      resolveDir: process.cwd(),
    }));
  },
};

// Bundle Page Constructor so the same compatibility fixes apply to npm consumers.
(async () => {
  const outdir = 'bundle';

  try {
    await rm(outdir, {recursive: true});
  } catch (e) {
    if (e instanceof Error && e.code !== 'ENOENT') {
      throw new Error('failed to build pages');
    }
  }

  await mkdir(outdir, {recursive: true});

  for (const format of ['cjs', 'esm']) {
    const config = configs.ts({
      entryPoints: ['src/App/index.tsx'],
      outfile: path.join(outdir, format === 'esm' ? 'index.mjs' : 'index.js'),
    });
    await esbuild.build({
      ...config,
      plugins: [...(format === 'esm' ? [esmExternalsPlugin] : []), ...config.plugins],
      target: 'es2020',
      external,
      format,
      banner: {js: '/* eslint-disable */'},
    });
  }
})();
