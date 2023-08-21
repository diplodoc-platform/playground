import {TextArea, Tabs, TabsProps, Card, Row, Col, Flex} from '@gravity-ui/uikit';


export type InputAreaProps = {
  handleSelectTab: (active: string) => void;
  tabItems: TabsProps['items'];
  tabActive: string;

  handleInputChange: (input: string) => void;
  input: string;
}

function InputArea(props: InputAreaProps) {

  const {tabActive, tabItems, input, handleInputChange, handleSelectTab} = props;

  return (
    <Col s="6">
      <Card size="m" className="area__card">
        <Row space={2}>
          <Col s="12">
            <Tabs activeTab={tabActive} items={tabItems} className="area__tabs" onSelectTab={handleSelectTab}/>
          </Col>
          <Col s="12"/>
          <Col s="12">
            <TextArea
              onUpdate={handleInputChange}
              hasClear={true}
              minRows={10}
              value={input}
              size="l"
            />
          </Col>
        </Row>
      </Card>
    </Col>);
}

export {InputArea};
export default {InputArea};
