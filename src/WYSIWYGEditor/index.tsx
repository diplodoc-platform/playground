import React from 'react';
import {
    Extension,
    BasePreset,
    BehaviorPreset,
    MarkdownBlocksPreset,
    MarkdownMarksPreset,
    YfmPreset,
} from '@doc-tools/yfm-editor';
import {useYfmEditor, YfmEditorView} from "@doc-tools/yfm-editor/bundle";

import initialMarkup from '../SplitViewEditor/mdContent';

function WYSIWYGEditor({}) {
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
        initialMarkup,
        initialToolbarVisible: true,
    });

    // Serialize current content in YFM
    editor.getValue();

    return <YfmEditorView autofocus editor={editor} />;
}

export default WYSIWYGEditor