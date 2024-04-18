import {useCallback, useState, useEffect}  from 'react';

import './index.scss';
import {useTabs} from "src/useTabs";
import { Tabs } from 'node_modules/@gravity-ui/uikit/build/esm/index';
import SplitViewEditor from "src/SplitViewEditor";
import PageConstructorEditor from "src/PageConstructorEditor";
import WYSIWYGEditor from "src/WYSIWYGEditor";
import Header from "src/Header";


const App = () => {
  return(
  <>
      <Header/>
      <Playground persistRestore={true} />
  </>)
};

export type PlaygroundProperties = {
  content?: string;
  persistRestore?: boolean;
}

enum EditorType {
  SPLIT = 'SPLIT_VIEW',
  WYSIWYG = 'WYSIWYG',
  PC = 'PC'

}

function Playground(props: PlaygroundProperties) {
  const [editorType, setEditorType] = useState(EditorType.SPLIT);

  const [
    items,
    activeTab,
    handleSetInputAreaTabActive
  ] = useTabs({
    items: [
        { id: EditorType.SPLIT, title: 'Split view', node: <SplitViewEditor/> },
        { id: EditorType.WYSIWYG, title: 'WYSIWYG', node: <WYSIWYGEditor/> },
        { id: EditorType.PC, title: 'Page constructor', node: <PageConstructorEditor/> }
    ],
    initial: EditorType.SPLIT,
  });

  return (
      <div className="playground">
        <Tabs className="tabs" activeTab={activeTab} items={items} onSelectTab={handleSetInputAreaTabActive}/>
        <div className="editor">
              {items?.find(el => el.id === activeTab).node}
        </div>
      </div>
  );
}

export {App, Playground};
export default {App, Playground};
