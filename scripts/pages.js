const {promises: {writeFile, mkdir, rm}} = require('fs');
const path = require('path');

const esbuild = require('esbuild');

const configs = require('./configs.js');
const {generateHTML} = require('../src/index.html.js');

(async () => {
    const outdir = 'docs';
    const projectName = 'diplodoc-demo';
    
    try {
        await rm(outdir, {recursive: true});
    } catch (e) {
        if (e instanceof Error && e.code !== 'ENOENT') {
            throw new Error('failed to build pages');
        }
    }

    await mkdir(outdir, {recursive: true});

    const html = generateHTML({
        env: 'production',
        csspath: path.join('/', projectName, 'index.css')});

    await writeFile(path.join(outdir, 'index.html'), html);

    await esbuild.build(configs.ts({
        entryPoints: ['src/index.tsx'],
        outfile: path.join(outdir, 'index.js'),
    }));
})();
