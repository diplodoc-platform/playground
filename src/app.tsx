import {useCallback, useState, useEffect}  from 'react';
import {Container, Row, Col} from '@gravity-ui/uikit';

import {CallOut} from './callout';
import {InputArea} from './input-area';
import {OutputArea} from './output-area';

import {useTabs} from './useTabs';
import {generateMD, generateHTML, generateTokens} from './generators';
import persistRestore from './persistRestore';

import './styles.css';

(window as any).MonacoEnvironment = {
  getWorker: (_, label: string) => {
    if (label === 'json') {
      return new Worker(
        new URL('monaco-editor/esm/vs/language/json/json.worker?worker', 'monaco-worker'),
      );
    }
    return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker?worker', 'monaco-worker'));
  },
};

const App = () => {
    return(<>
      <Container>
        <CallOut />
        <Playground persistRestore={true} />
      </Container>
    </>)
};

export type PlaygroundProperties = {
    persistRestore?: boolean;
}

function Playground(props: PlaygroundProperties) {
  const persist = useCallback(persistRestore.persist, []);
  const restore = useCallback(persistRestore.restore, []);
  const [input, setInput] = useState(props.persistRestore ? (restore() ?? '') : '');
  const [generated, setGenerated] = useState(input);

  const generate = useCallback((active: string) => {
    if (active === 'markdown') {
      setGenerated(generateMD(input));
    } else if (active === 'html') {
      setGenerated(generateHTML(input));
    } else if (active === 'tokens') {
      setGenerated(generateTokens(input));
    } else if (active === 'preview') {
      setGenerated(generateHTML(input));
    } else {
      setGenerated(input);
    }
  }, [input]);

  const [
    inputItems,
    inputActive,
    handleSetInputAreaTabActive
  ] = useTabs({
    items: [ { id: 'input', title: 'input' } ],
    initial: 'input',
  });

  const [
      outputItems,
      outputActive,
      handleSetOutputAreaTabActive
  ] = useTabs({
    items: [
      { id: 'preview', title: 'html preview' },
      { id: 'html', title: 'html' },
      { id: 'markdown', title: 'markdown' },
      { id: 'tokens', title: 'tokens' },
    ],
    initial: 'preview',
    onSetActive: generate,
  });

  const handleInputChange = (input?: string) => {
    setInput(input || '');
  };

  useEffect(() => {
    generate(outputActive);

    if (props.persistRestore) {
        persist(input);
    }
  }, [input]);

  return (
    <Row space={6} className="diplodoc-playground">
      <Col s="12"/>
      <InputArea
        handleSelectTab={handleSetInputAreaTabActive}
        handleInputChange={handleInputChange}
        input={input}

        tabActive={inputActive}
        tabItems={inputItems}
      />
      <OutputArea
        handleSelectTab={handleSetOutputAreaTabActive}
        tabItems={outputItems}
        tabActive={outputActive}
        output={generated}
      />
    </Row>
  );
}

export {App, Playground};
export default {App, Playground};
