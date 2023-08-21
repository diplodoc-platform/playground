import {Card, Text, Row, Col} from '@gravity-ui/uikit';

function CallOut() {
  return (<Row space={4}>
    <Col s="12"/>
    <Col s="12">
      <Card
        className="callout__card"
        type="container"
        view="filled"
        theme="info"
        size="l"
      >
        <Text variant="display-4" className="callout__heading">diplodoc</Text>
      </Card>
    </Col>
  </Row>);
}

export {CallOut}
export default {CallOut}
