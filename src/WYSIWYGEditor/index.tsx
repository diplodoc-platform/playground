import React, {useEffect, useState} from 'react';
import {
  BasePreset,
  BehaviorPreset,
  Extension,
  MarkdownBlocksPreset,
  MarkdownMarksPreset,
  YfmPreset,
} from '@doc-tools/yfm-editor';
import {YfmEditorView, useYfmEditor} from '@doc-tools/yfm-editor/bundle';
import {Toaster} from "@gravity-ui/uikit";

import {deleteQuery, persist, prefill} from 'src/utils';

function WYSIWYGEditor({}) {
  const toaster = new Toaster();

  const [input, setInput] = useState(prefill() || '');

  if(input){
    persist(input)
  } else {
    deleteQuery('input')
  }

  const extensions = React.useMemo<Extension>(
    () => (builder) =>
      builder
        .use(BasePreset, {})
        .use(BehaviorPreset, {})
        .use(MarkdownBlocksPreset, {image: false, heading: false})
        .use(MarkdownMarksPreset, {})
        .use(YfmPreset, {}),
    [],
  );

  const editor = useYfmEditor({
    linkify: true,
    allowHTML: false,
    extensions,
    initialMarkup: input,
    initialToolbarVisible: true,
    initialEditorType: 'wysiwyg',
  });

  useEffect(() => {
    editor.on('change', () => persist(editor.getValue()));
    setInput(editor.getValue())
  }, [input])

  return <YfmEditorView autofocus editor={editor} toaster={toaster}/>;
}

export default WYSIWYGEditor;
