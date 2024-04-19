import './index.scss';
import {useTabs} from 'src/useTabs';
import {Tabs} from 'node_modules/@gravity-ui/uikit/build/esm/index';
import SplitViewEditor from 'src/SplitViewEditor';
import PageConstructorEditor from 'src/PageConstructorEditor';
import WYSIWYGEditor from 'src/WYSIWYGEditor';
import Header from 'src/Header';
import {restore} from '../utils';

export type PlaygroundProperties = {
  content?: string;
  persistRestore?: boolean;
};

export enum EditorType {
  SPLIT = 'SPLIT_VIEW',
  WYSIWYG = 'WYSIWYG',
  PC = 'PC',
}

const mode = {
  [EditorType.SPLIT]: {
    title: 'Split view',
    node: <SplitViewEditor persistRestore={true} />,
  },
  [EditorType.WYSIWYG]: {
    title: 'WYSIWYG',
    node: <WYSIWYGEditor />,
  },
  [EditorType.PC]: {
    title: 'Page constructor',
    node: <PageConstructorEditor />,
  },
};


const App = () => {
  const urlMode = restore('mode');

  const [items, activeTab, handleSetInputAreaTabActive] = useTabs({
    items: Object.entries(mode).map(([key, value]) => ({
      id: key,
      ...value,
    })),
    initial: mode[urlMode] ? urlMode : EditorType.SPLIT,
  });

  return (
    <>
      <Header items={items} activeTab={activeTab} handleSetInputAreaTabActive={handleSetInputAreaTabActive}/>
      <Playground persistRestore={true}>
        {mode[activeTab].node}
      </Playground>
    </>
  );
};

function Playground({children}) {
  return (
    <div className="playground">
      <div className="editor">{children}</div>
    </div>
  );
}

export {App, Playground};
export default {App, Playground};
