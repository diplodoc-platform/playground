import {useCallback, useState, useEffect}  from 'react';
import {TextArea, Tabs, TabsProps, Card, Text, Container, Row, Col, Flex} from '@gravity-ui/uikit';

import {CallOut} from './callout';
import {InputArea} from './input-area';
import {OutputArea} from './output-area';

import {useTabs} from './useTabs';
import {generateMD, generateHTML, generateTokens} from './generators';

import '@doc-tools/transform/dist/js/yfm.js'

(window as any).MonacoEnvironment = {
  getWorker: (workerId: string, label: string) => {
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
        <Playground />
      </Container>
    </>)
};

function Playground() {
  const [input, setInput] = useState('');
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

  const handleInputChange = (input: string) => {
    setInput(input);
  };

  useEffect(() => {
    generate(outputActive);
  }, [input]);

  return (
    <Row space={6}>
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

export {App};
export default {App};
