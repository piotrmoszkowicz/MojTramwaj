import React from 'react';
import {
  StyleSheet
} from 'react-native';
import {
  MapView,
  Permissions,
  Location
} from 'expo';
import { Container, Header, Text, Icon, Fab, Button } from 'native-base';


export default class MapScreen extends React.Component {
  static navigationOptions = {
    title: 'Mapa',
    headerRight: < Icon name = {
      'md-refresh'
    }
    onPress = {
        this.renderTrams
    }
    />,
  };

  constructor(props){
    super(props);

    this.state = {
      lastUpdatedTimeStamp: Date.now(),
      trams: [],
      loadingTrams: true,
      mapRegion: {
        latitude: 50.0646501,
        longitude: 19.9449799,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      },
      acitve: true,
    };
  }

  async getTramsLocations(lastTimeStamp) {
    const apiLink = `http://www.ttss.krakow.pl/internetservice/geoserviceDispatcher/services/vehicleinfo/vehicles?positionType=CORRECTED&colorType=ROUTE_BASED&lastUpdate=${lastTimeStamp}`;
    console.log(apiLink);
    return fetch(apiLink)
      .then((response) => response.json())
      .catch((err) => {
        console.error(err);
      });
  }

  renderTrams(){
    this.getTramsLocations(this.state.lastUpdatedTimeStamp).then((json) => {
      let trams = json.vehicles;

      let tramsToDraw = [];

      for (let i = 0; i < trams.length; i++) {
        if (typeof trams[i].isDeleted !== 'undefined' && trams[i].isDeleted || trams[i].id === '0') {
          continue;
        }
        trams[i].latitude /= 3600000.0;
        trams[i].longitude /= 3600000.0;
        tramsToDraw.push(trams[i]);
      }

      this.setState({
        trams: tramsToDraw,
        loadingTrams: false,
      });
    });
  }

  async componentDidMount() {
    this.renderTrams();

    this.myRegion();
  }

  handleMapRegionChange = mapRegion => {
    this.setState({
      mapRegion
    });
  }

  myRegion = async () => {
    const response = await Permissions.askAsync(Permissions.LOCATION);
    if (response.status === 'granted') {
      try {
        let location = await Location.getCurrentPositionAsync({});
        this.setState({
          mapRegion: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  render() {
    return (
      <Container>
          <MapView
          style = {
            {
              flex: 1
            }
          }
          region = { this.state.mapRegion }
          onRegionChangeComplete = {
            this.handleMapRegionChange
          }
          >
            {this.state.trams.map((tram) => {
              let i = 0;
              let crds = {
                latitude: tram.latitude,
                longitude: tram.longitude,
              };
              let number = tram.name.split(' ')[0];
              return (
                <MapView.Circle
                  key={i++}
                  center={crds}
                  radius={30}
                  fillColor={"#000"}
                >
                  <Text style={{color: "#FFFFFF"}}>{number}</Text>
                </MapView.Circle>
              );
            })}
          </MapView>
          <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="md-compass" />
            <Button style={{ backgroundColor: '#34A34F' }}
                onPress={this.myRegion}
            >
              <Icon name="navigate" />
            </Button>
            <Button style={{ backgroundColor: '#3B5998' }}
            onPress={() => this.setState({
              mapRegion: {
                latitude: 50.0646501,
                longitude: 19.9449799,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            }})}
            >
              <Icon name="md-locate" />
            </Button>
          </Fab>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: '#fff',
  },
});
