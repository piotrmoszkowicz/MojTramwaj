import React from 'react';
import {
  StyleSheet
} from 'react-native';
import {
  MapView,
  Permissions,
  Location
} from 'expo';
import { Container, Header, Text, Icon } from 'native-base';


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
    };

    console.log(this.state);

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

      console.log(trams.length);

      for (let i = 0; i < trams.length; i++) {
        console.log(i);
        if (typeof trams[i].isDeleted !== 'undefined' && trams[i].isDeleted || trams[i].id === '0') {
          continue;
        }
        trams[i].latitude /= 3600000.0;
        trams[i].longitude /= 3600000.0;
        tramsToDraw.push(trams[i]);
      }

      console.log(tramsToDraw);

      this.setState({
        trams: tramsToDraw,
        loadingTrams: false,
      });
    });
  }

  async componentDidMount() {
    this.renderTrams();

    const response = await Permissions.askAsync(Permissions.LOCATION);
    if (response.status === 'granted'){
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
      }
      catch (err) {
        console.error(err);
      }
    }
  }

  handleMapRegionChange = mapRegion => {
    this.setState({
      mapRegion
    });
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
                  radius={15}
                  fillColor={"#000"}
                >
                  <Text>{number}</Text>
                </MapView.Circle>
              );
            })}
          </MapView>
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
