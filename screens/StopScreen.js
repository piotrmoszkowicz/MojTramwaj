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
  ListItem,
  Spinner
} from 'native-base';

export default class StopScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      trams: [],
      loadingTrams: true,
      alertText: '',
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

  updateTrams = () => {
    this.setState({
      loadingTrams: true,
    });
    this.downloadTrams().then((json) => {
      let alertStr = json.generalAlerts.reduce((prev, cur) => {
        return `${prev}\n${cur}`;
      });
      this.setState({
        trams: json.actual,
        alertText: alertStr,
        loadingTrams: false,
      });
    });
  }

  componentDidMount = () => {
    this.updateTrams();
    this.state.intervalStuff = setInterval(() => {
      this.updateTrams();
    }, 15000);
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalStuff);
  }

  render() {
    return (
      <Container>
        <Content>
          <Text>{this.state.alertText}</Text>
          <Spinner style={this.state.loadingTrams ? {opacity: 1, height: "auto"} : {opacity: 0, height: 0}}/>
          <List dataArray = {
            this.state.trams
          }
          style={this.state.loadingTrams ? {opacity: 0, height: 0} : {opacity: 1, height: "auto"}}
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
                      <Text>{ item.mixedTime === '0 Min' ? <Icon name="md-fastforward" /> : item.mixedTime }</Text>
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
