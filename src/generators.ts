import MarkdownIt from 'markdown-it';
// @ts-ignore
import transform from '@doc-tools/transform';
// @ts-ignore
import md from '@doc-tools/transform/lib/md';
import { mdRenderer } from '@diplodoc/markdown-it-markdown-renderer';

function generateMD(input: string) {
  const mdit = new MarkdownIt({html: true});
  mdit.use(mdRenderer);

  try {
    return mdit.render(input, {source: input.split('\n')});
  } catch(e) {
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
  const {parse} = md({});

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
