import React, {Component} from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';

class MapContainer extends Component {
  state = {
    markers: [],
    markerInfo: [],
    activeMarker: null,
    activeInfo: null,
    showInfo: false
  }

  loadMarkers = (mapProps, map) => {
    this.props.getYelpInfo();
  }

  onMarkerClick = (marker) => {
    if (marker === this.state.activeMarker) {
      this.setState({ activeMarker: marker })
      this.setState({ showInfo: true })
    }
  };

  onInfoWindowClose = () => {};

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
        onReady={this.loadMarkers}>
          {/* <Marker onClick={this.onMarkerClick}
            position={this.props.locations.pos}/> */}
          {/* <InfoWindow
            onClose={this.onInfoWindowClose}>
            <div>
              <h3>{this.state.activeMarker.name}</h3>
            </div>
          </InfoWindow> */}
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCxXK6lMDoTo4dHosssdE0SyJ8UtVOtpbU")
})(MapContainer)