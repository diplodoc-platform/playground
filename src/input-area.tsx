import {useEffect, useState, useRef} from 'react'
import {TextArea, Tabs, TabsProps, Card, Row, Col, Flex} from '@gravity-ui/uikit';

import Editor, {Monaco} from '@monaco-editor/react';

export type InputAreaProps = {
  handleSelectTab: (active: string) => void;
  tabItems: TabsProps['items'];
  tabActive: string;

  handleInputChange: (input: string) => void;
  input: string;
}

function InputArea(props: InputAreaProps) {
  const monacoRef = useRef(null);

  const {tabActive, tabItems, input, handleInputChange, handleSelectTab} = props;

  const editorOptions = {minimap: {enabled: false}, lineNumbers: "off" as const};

  const lines = monacoRef?.current?.getModel()?.getLineCount() ?? 10; 
  const height = `${lines * 16}px`;

  const handleOnMount = (editor, monaco) => {
    monacoRef.current = editor;
  }

  return (
    <Col s="6">
      <Card size="m" className="area__card">
        <Row space={2}>
          <Col s="12">
            <Tabs activeTab={tabActive} items={tabItems} className="area__tabs" onSelectTab={handleSelectTab}/>
          </Col>
          <Col s="12"/>
          <Col s="12">
            <Card size="m" className="area__card">
                <Editor height={height} defaultLanguage="markdown" defaultValue={input} onChange={handleInputChange} options={editorOptions} onMount={handleOnMount} />
            </Card>
          </Col>
        </Row>
      </Card>
    </Col>);
}

export {InputArea};
export default {InputArea};
