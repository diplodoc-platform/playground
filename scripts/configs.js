const path = require('path');

const esbuild = require('esbuild');

const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

const polyfillNode = require("esbuild-plugin-polyfill-node").polyfillNode;
const {sassPlugin} = require('esbuild-sass-plugin');

const gravityPathBase = 'node_modules/@gravity-ui/uikit/build/cjs/components';

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
].map(relpath => path.join(gravityPathBase, relpath));

const configuredSassPlugin = sassPlugin({
    cssImports: true,
    async transform(source) {
        return (await postcss([
            autoprefixer({cascade: false}),
            postcssPresetEnv({stage: 0}),
        ]).process(source, {from: undefined})).css;
    },
});

const configuredNodePolyfillPlugin = polyfillNode();

const common = {
  platform: 'browser',
  sourcemap: true,
  minify: true,
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
}

const css = ({entryPoints, outfile, outdir} = {}) => {
    entryPoints = {
        ...(entryPoints ?? {}),
        ...gravitycss,
    };

    const config = {
        ...common,
        plugins: [configuredSassPlugin],
    }

    if (outdir) {
        config.outdir = outdir;
    } else {
        config.outfile = outfile;
    }

    return config;
}

module.exports = {ts, css};
exports.default = {ts, css};
