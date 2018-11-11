import React, {Component} from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';

class MapContainer extends Component {
  state = {
    activeMarker: null,
    showInfo: false,
    visibleMarker: true
  }

  // loadMarkers = (map) => {
  //   this.props.markers.map((item, index) => {
  //     let item = item;
  //     let marker = new google.maps.Marker({
  //       key:{index},
  //       position:{item}
  //     })
  //   })
  // }


  onMarkerClick = () => {this.setState({ showInfo: true })};

  componentDidMount() {}

  render() {
    const center = {
      lat: 32.322613,
      lng: -95.262592
    }

  // Display Map
    return (
      <Map 
        aria-label="map"
        role="application"
        google={this.props.google}
        zoom={15}        
        initialCenter={center}
        onReady={this.loadMarkers}
        >
        {this.props.yelpData.map((item) => (
          <Marker
            key={item.id}
            position={{lat: item.coordinates.latitude, lng: item.coordinates.longitude}}
          />
        ))}

        {/* <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showInfo}
          onClose={this.InfoWindowClose} >
          <div>This is your info!</div>
        </InfoWindow> */}
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCxXK6lMDoTo4dHosssdE0SyJ8UtVOtpbU")
})(MapContainer)