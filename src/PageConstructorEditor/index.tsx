import React, {useCallback, useState} from 'react';


import {ContentTransformer, Editor,} from '@gravity-ui/page-constructor/editor';
import { PageContent } from 'node_modules/@gravity-ui/page-constructor/build/esm/index';
import data from './data.json';
import {contentTransformer} from "@gravity-ui/page-constructor/server";
import {memoizeLast} from "src/PageConstructorEditor/utils";

interface MyAppEditorProps {
  initialContent: PageContent;
  transformContent: ContentTransformer;
  onChange: (content: PageContent) => void;
}

const contentTransformerMemoized = memoizeLast(contentTransformer);


function PageConstructorEditor () {
    const [input, setInput] = useState(data)
    const lang = 'ru'

    const transformContent = useCallback(
        (content: PageContent) => ({
            ...content,
            ...contentTransformerMemoized({content, options: {lang}}),
        }),
        [lang],
    );

    return <Editor content={input} onChange={setInput} transformContent={transformContent} />
}

export default PageConstructorEditor