import React, {Component} from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';

class MapContainer extends Component {
  state = {
    activeMarker: null,
    showInfo: false,
    visibleMarker: true
  }

  loadMarkers = () => {
    this.props.markers.map((item, index) => {
      return (
          <Marker
            key={index}
            position={{lat: item.latitude, lng: item.longitude }}
          />
        );
      })
    };

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
        zoom={13}        
        initialCenter={center}
        onReady={this.loadMarkers}
        >
        

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