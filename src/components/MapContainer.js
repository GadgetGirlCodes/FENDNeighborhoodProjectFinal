import React, {Component} from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';

class MapContainer extends Component {
  state = {
    selectedPlace: null,
    activeMarker: null,
    showInfo: false,
  }

  onMarkerClick = (marker, props, e) => {
    this.setState({ 
      activeMarker: marker,
      selectedPlace: props,
      showInfo: !this.state.showInfo })
    };

  onInfoClose = (props) => {
    if (this.state.showInfo) {
      this.setState({
        showInfo: false,
        selectedPlace: null,
        activeMarker: null
      })
    }
  };

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
        {/* Display location information as markers on map */}
        {this.props.filteredListings !== null ?
          (this.props.filteredListings.map((item) => (
            <Marker
              key={item.id}
              position={{lat: item.coordinates.latitude, lng: item.coordinates.longitude}}
              name={item.name}
              onClick={this.onMarkerClick}
            />))) :
           (this.props.yelpData.map((item) => (
            <Marker
              key={item.id}
              position={{lat: item.coordinates.latitude, lng: item.coordinates.longitude}}
              name={item.name}
              onClick={this.onMarkerClick}
            />)        
            ))
            }
        <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showInfo}
            onClose={this.onInfoClose}>
              <div>
                <h1>Somethingsomethingsomething</h1>
              </div>
          </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCxXK6lMDoTo4dHosssdE0SyJ8UtVOtpbU")
})(MapContainer)