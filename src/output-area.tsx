import {Row, Col, Card, Tabs, TabsProps, TextArea} from '@gravity-ui/uikit';

export type OutputAreaProps = {
  handleSelectTab: (active: string) => void;
  tabItems: TabsProps['items'];
  tabActive: string;

  handleInputChange?: (input: string) => void;
  output: string;
};

function OutputArea(props: OutputAreaProps) {
  let {output, tabItems, tabActive, handleSelectTab, handleInputChange} = props;

  if (!handleInputChange) {
    handleInputChange = (a: string) => {}
  }

  return (
    <Col s="6">
      <Card size="m" className="area__card">
        <Row space={2}>
          <Col s="12">
            <Tabs
              onSelectTab={handleSelectTab}
              activeTab={tabActive}
              items={tabItems}
              className="area__tabs"
            />
          </Col>
          <Col s="12" />
          <Col s="12">
            {tabActive === 'preview'
                ? <Card size="m" className="yfm area__yfm">
                    <div dangerouslySetInnerHTML={{__html: output}} className="area__card"></div>
                  </Card>
                : <TextArea
                    onUpdate={handleInputChange}
                    value={output} 
                    size="l" />
            }
          </Col>
        </Row>
      </Card>
    </Col>
  );
}

export {OutputArea};
export default {OutputArea};
