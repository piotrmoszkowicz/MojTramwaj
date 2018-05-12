import React from 'react';
import {
  StyleSheet
} from 'react-native';
import {
  MapView,
  Permissions,
  Location
} from 'expo';
import { Container, Header, Text } from 'native-base';


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Mapa',
  };

  constructor(props){
    super(props);

    this.state = {
      mapRegion: {
        latitude: 50.0646501,
        longitude: 19.9449799,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
    };
  }

  async componentDidMount() {
    const response = await Permissions.askAsync(Permissions.LOCATION);
    if (response.status === 'granted'){
      try {
        let location = await Location.getCurrentPositionAsync({});
        this.setState({
          mapRegion: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
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
          />
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
