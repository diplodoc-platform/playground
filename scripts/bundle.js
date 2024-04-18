const {
  promises: {writeFile, mkdir, rm},
} = require('fs');
const path = require('path');

const esbuild = require('esbuild');

const configs = require('./configs.js');

const {dependencies, peerDependencies, devDependencies} = require('../package.json');

const external = [
  ...Object.keys(peerDependencies ?? {}),
  ...Object.keys(devDependencies ?? {}),
  ...Object.keys(dependencies ?? {}),
];

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

  await esbuild.build({
    ...configs.ts({
      entryPoints: ['src/app.tsx'],
      outfile: path.join(outdir, 'index.js'),
    }),
    target: 'es2020',
    external,
    format: 'cjs',
    banner: {js: '/* eslint-disable */'},
  });
})();
