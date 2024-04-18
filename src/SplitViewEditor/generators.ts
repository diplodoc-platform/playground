import MarkdownIt from 'markdown-it';

// @ts-ignore
import transform from '@diplodoc/transform';
// @ts-ignore
import transformMarkdown from '@diplodoc/transform/lib/md';

import {mdRenderer} from '@diplodoc/markdown-it-markdown-renderer';

// @ts-ignore
import meta from 'markdown-it-meta';
// @ts-ignore
import sup from 'markdown-it-sup';
import notes from '@diplodoc/transform/lib/plugins/notes';
import cut from '@diplodoc/transform/lib/plugins/cut';
import checkbox from '@diplodoc/transform/lib/plugins/checkbox';
import anchors from '@diplodoc/transform/lib/plugins/anchors';
import monospace from '@diplodoc/transform/lib/plugins/monospace';
import imsize from '@diplodoc/transform/lib/plugins/imsize';
import file from '@diplodoc/transform/lib/plugins/file';
import includes from '@diplodoc/transform/lib/plugins/includes';
import tabs from '@diplodoc/transform/lib/plugins/tabs';
import video from '@diplodoc/transform/lib/plugins/video';
import table from '@diplodoc/transform/lib/plugins/table';

const diplodocOptions = {
  lang: 'en',
  path: '',
};

function generateMD(input: string) {
  const md = new MarkdownIt({html: true});

  md.use(meta);
  md.use(notes, diplodocOptions);
  md.use(cut, diplodocOptions);
  md.use(sup, diplodocOptions);
  md.use(checkbox, diplodocOptions);
  md.use(anchors, diplodocOptions);
  md.use(monospace, diplodocOptions);
  md.use(imsize, diplodocOptions);
  md.use(file, diplodocOptions);
  md.use(includes, diplodocOptions);
  md.use(tabs, diplodocOptions);
  md.use(video, diplodocOptions);
  md.use(table, diplodocOptions);
  md.use(mdRenderer);

  try {
    return md.render(input, {source: input.split('\n')});
  } catch (e) {
    console.error(e);
    return '';
  }
}

function generateHTML(input: string) {
  try {
    return transform(input).result.html;
  } catch (e) {
    console.error(e);
    return '';
  }
}

function generateTokens(input: string) {
  const {parse} = transformMarkdown({});

  try {
    const tokens = parse(input);

    return tokens?.length ? JSON.stringify(tokens, null, 4) : '';
  } catch (e) {
    console.error(e);
    return '';
  }
}

export {generateHTML, generateMD, generateTokens};
export default {generateHTML, generateMD, generateTokens};
