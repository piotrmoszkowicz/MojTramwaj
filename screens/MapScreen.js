import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import {
  MapView,
  Permissions,
  Location
} from 'expo';
import { Container, Header, Text, Icon, Fab, Button, Spinner } from 'native-base';


export default class MapScreen extends React.Component {
  static navigationOptions = {
    title: 'Mapa',
    /* headerRight:
      <Icon
        name={'md-refresh'}
        onPress = { this.renderTrams }
        style = {{ marginRight: 10 }}
      />, */
  };

  constructor(props){
    super(props);

    this.state = {
      lastUpdatedTimeStamp: Date.now(),
      trams: [],
      loadingTrams: true,
      loadingLocation: false,
      mapRegion: {
        latitude: 50.0646501,
        longitude: 19.9449799,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
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
    this.setState({
      loadingTrams: true,
    });
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
        lastUpdatedTimeStamp: Date.now()
      });
    });
  }

  async componentDidMount() {
    this.renderTrams();
    setInterval(() => {
      console.log(this.state);
      this.renderTrams();
    }, 15000);
  }

  handleMapRegionChange = mapRegion => {
    this.setState({
      mapRegion
    });
  }

  myRegion = async () => {
    this.setState({
      loadingLocation: true,
    })
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
          },
          loadingLocation: false,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  render() {
    return (
      <Container>
        <Spinner style={this.state.loadingTrams || this.state.loadingLocation ? {opacity: 1, height: "auto"} : {opacity: 0, height: 0}}/>
        <MapView
          key={665}
          style = {this.state.loadingTrams || this.state.loadingLocation ? {opacity: 0, flex: 1, height: 0} : {opacity: 1, flex: 1, height: "auto"}}
          region = { this.state.mapRegion }
          onRegionChangeComplete = {
            this.state.loadingTrams ? null : this.handleMapRegionChange
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
                <MapView.Marker coordinate={crds} key={i++}>
                  <View style={styles.circle}>
                    <Text style={styles.pinText}>{number}</Text>
                  </View>
                </MapView.Marker>
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
  circle: {
      width: 30,
      height: 30,
      borderRadius: 30 / 2,
      backgroundColor: 'red',
    },
    pinText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 16,
      marginBottom: 10,
    },
});
