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

import {persist, prefill, restore} from 'src/utils';

function WYSIWYGEditor({}) {
  const [input, setInput] = useState(prefill() || '');

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
  });

  useEffect(() => {
    editor.on('change', () => persist(editor.getValue()));
  }, [])

  useEffect(() => {
      persist(input);
  }, [input]);

  return <YfmEditorView autofocus editor={editor} />;
}

export default WYSIWYGEditor;
