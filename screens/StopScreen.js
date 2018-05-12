import React from 'react';
import {
  StyleSheet
} from 'react-native';

import {
  Icon,
  Text,
  Container,
  Content,
  Header,
  Left,
  Col,
  Row,
  Grid,
  List,
  ListItem
} from 'native-base';

export default class StopScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      trams: []
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.stop.name}`,
  });

  downloadTrams = () => {
    const { params } = this.props.navigation.state;
    const apiLink = `http://www.ttss.krakow.pl/internetservice/services/passageInfo/stopPassages/stop?stop=${parseInt(params.stop.id)}&mode=departure`;

    return fetch(apiLink)
      .then((response) => response.json())
      .catch((err) => {
        console.error(err);
      });
  }

  componentWillMount = () => {
    // this.downloadTrams();
    this.downloadTrams().then((json) => {
      this.setState({
        trams: json.actual
      });
    });
  }

  render() {
    return (
      <Container>
        <Content>
          <List dataArray = {
            this.state.trams
          }
          renderRow = {
              (item) =>
              <ListItem>
                <Grid>
                  <Row>
                    <Col style={{width: "10%"}}>
                      <Text>{ item.patternText }</Text>
                    </Col>
                    <Col style={{width: "70%"}}>
                      <Text>{ item.direction }</Text>
                    </Col>
                    <Col style={{width: "20%"}}>
                      <Text>{ item.mixedTime }</Text>
                    </Col>
                    </Row>
                  </Grid>
              </ListItem>
            } >
            </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
});
