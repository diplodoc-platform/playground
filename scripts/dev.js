const esbuild = require('esbuild');
const {promises: {copyFile}} = require('fs');
const path = require('path');
const {sassPlugin} = require('esbuild-sass-plugin');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const postcss = require('postcss');
const polyfillNode = require("esbuild-plugin-polyfill-node").polyfillNode;

polyfillNode.name = 'node-polyfill';

const {promises: {mkdir, rm}} = require('fs');

const gravitycss = [
'layout/variables.css',
'layout/Row/Row.css',
'layout/Col/Col.css',
'layout/Container/Container.css',
'Card/Card.css',
'variables.css',
'Tabs/Tabs.css',
'controls/mixins.css',
'controls/variables.css',
'controls/TextArea/TextArea.css',
].map(relpath => path.join('node_modules/@gravity-ui/uikit/build/cjs/components', relpath));

(async () => {
    let ctx;

    await rm('www', {recursive: true});
    await mkdir('www', {recursive: true});

    ctx = await buildCSS();
    ctx = await buildTS();
    
    const htmlIn = path.join(process.cwd(), 'src', 'index.html');

    const htmlOut = path.join(process.cwd(), 'www', 'index.html');

    await copyFile(htmlIn, htmlOut);

    await ctx.watch();

    let { host, port } = await ctx.serve({
        servedir: 'www',
    });

    console.log('listening on host:', host, 'and port:', port);
})();

async function buildTS() {
  return esbuild.context({
        entryPoints: ['src/index.tsx'],
        jsx: 'transform',
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        bundle: true,
        outfile: 'www/index.js',
        platform: 'browser',
        logLevel: 'debug',
        plugins: [
            polyfillNode(),
            sassPlugin({
                cssImports: true,
                async transform(source) {
                    const {css} = await postcss([
                        autoprefixer({cascade: false}),
                        postcssPresetEnv({stage: 0}),
                    ]).process(source, {from: undefined});

                    return css;
                },
            }),
        ],
    });

}

async function buildCSS() {
  return esbuild.context({
        entryPoints: [
          'src/styles.css',
          ...gravitycss,
        ],
        bundle: true,
        // format: 'iife',
        outdir: 'www',
        platform: 'browser',
        logLevel: 'debug',
        plugins: [
            polyfillNode(),
            sassPlugin({
                cssImports: true,

                async transform(source) {
                    const {css} = await postcss([
                        autoprefixer({cascade: false}),
                        postcssPresetEnv({stage: 0}),
                    ]).process(source, {from: undefined});

                    return css;
                },
            }),
        ],
    });
}


