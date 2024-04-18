const {
  promises: {writeFile, mkdir, rm},
} = require('fs');
const path = require('path');

const esbuild = require('esbuild');

const configs = require('./configs.js');
const {generateHTML} = require('../src/index.html.js');

(async () => {
  const outdir = 'www';

  try {
    await rm(outdir, {recursive: true});
  } catch (e) {
    if (e instanceof Error && e.code !== 'ENOENT') {
      throw new Error('failed to build dev');
    }
  }

  await mkdir(outdir, {recursive: true});

  const html = generateHTML({
    env: 'development',
    csspath: [path.join('/', 'index.css'), path.join('/', 'styles.css')],
  });

  await writeFile(path.join(outdir, 'index.html'), html);

  let ctx;

  ctx = await esbuild.context(
    configs.ts({
      entryPoints: ['src/index.tsx'],
      outdir,
    }),
  );

  let {host, port} = await ctx.serve({
    servedir: outdir,
  });

  console.log(`http://${host}:${port}`);
})();
