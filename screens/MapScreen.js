import React from 'react';
import {
  StyleSheet
} from 'react-native';
import {
  MapView
} from 'expo';
import { Container } from 'native-base';


export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Mapa',
  };

  render() {
    return (
      <Container>
          <MapView
          style = {
            {
              flex: 1
            }
          }
          initialRegion = {
            {
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
          }
          />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
