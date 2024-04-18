import React, {useCallback, useState} from 'react';

import {Editor} from '@gravity-ui/page-constructor/editor';
import {PageContent} from 'node_modules/@gravity-ui/page-constructor/build/esm/index';
import {contentTransformer} from '@gravity-ui/page-constructor/server';
import {memoizeLast} from 'src/PageConstructorEditor/utils';
import {persist, prefill} from "src/utils";
import {ErrorBoundary} from "react-error-boundary";

const contentTransformerMemoized = memoizeLast(contentTransformer);

function PageConstructorEditor() {
  const [input, setInput] = useState(prefill() || '');
  const lang = 'ru';
    const onChange = (input) => {
        setInput(input)
        persist(JSON.stringify(input))
    }

  const transformContent = useCallback(
    (content: PageContent) => ({
      ...content,
      ...contentTransformerMemoized({content, options: {lang}}),
    }),
    [lang],
  );

  return <Editor content={input['blocks'] ? input : {blocks: []}} onChange={onChange} transformContent={transformContent} />;
}

function SafePageConstructorEditor() {
    return <ErrorBoundary fallback={<p>Something went wrong. You may have entered the wrong PC config format, it must start with "blocks" array.</p>}>
        <PageConstructorEditor />
    </ErrorBoundary>
}

export default SafePageConstructorEditor;
