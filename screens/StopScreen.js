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
  Body,
  Col,
  Row,
  Grid,
  List,
  ListItem,
  Spinner
} from 'native-base';

import getVehicleInfo from '../utils/tramUtils';

console.log(getVehicleInfo);

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

  downloadTrams = (type) => {
    const { params } = this.props.navigation.state;
    const apiLink = `http://www.ttss.krakow.pl/internetservice/services/passageInfo/stopPassages/stop?stop=${parseInt(params.stop.id)}&mode=${type}`;

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
    this.downloadTrams('departure').then((json) => {
      let alertStr = '';
      for(let i=0;i<json.generalAlerts.length;i++){
        alertStr += json.generalAlerts[i].title += '\n';
      }
      this.downloadTrams('arrival').then((jsonArr) => {
        // console.log(jsonArr, json);
        let wannaGoHome = [];
        for(let i=jsonArr.actual.length - 1;i>=0;i--){
          let found = false;
          // console.log(jsonArr.actual[i]);
          for(let j=json.actual.length - 1;j>=0;j--){
            // console.log(jsonArr.actual[i], json.actual[j]);
            if (jsonArr.actual[i].vehicleId === json.actual[j].vehicleId) {
              found = true;
              break;
            }
          }
          if (!found && jsonArr.actual[i].vehicleId){
            let vehId = jsonArr.actual[i].vehicleId;
            let vehInfo = getVehicleInfo.getVehicleInfo(vehId);

            if(vehInfo.zaj === 'NH'){
              jsonArr.actual[i].direction = 'Zajezdnia Nowa Huta';
            }
            else {
              jsonArr.actual[i].direction = 'Zajezdnia Podgórze';
            }

            wannaGoHome.push(jsonArr.actual[i]);
          }
        }
        this.setState({
          trams: json.actual.concat(wannaGoHome).sort((a,b) => 
            a.actualRelativeTime - b.actualRelativeTime
          ),
          // trams: json.actual,
          alertText: alertStr,
          loadingTrams: false,
        });
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
        <Text style={{alignSelf: 'baseline', width: "90%", marginLeft: "5%", color: 'red'}}>{this.state.alertText}</Text>
        <Content>
          <Spinner style={this.state.loadingTrams ? {opacity: 1, height: "auto"} : {opacity: 0, height: 0}}/>
          <List dataArray = {
            this.state.trams
          }
          style={this.state.loadingTrams ? {opacity: 0, height: 0} : {opacity: 1, height: "auto"}}
          renderRow = {
              (item) =>
              <ListItem style={{marginTop: 0}}>
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
