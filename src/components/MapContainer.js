import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

class MapContainer extends Component {
  state = {
    markers: [],
    selectedPlace: null,
    activeMarker: null,
    showInfo: false,
  }

  createMarkers = () => {
    if (this.props.markerInfo !== null) {
      let markers = this.props.markerInfo.forEach(marker => {
        marker = new this.props.google.maps.Marker({
          position: marker.position,
          key: marker.key
        })
        return marker;
      })
      console.log(markers);
      this.setState({ markers: markers });
    }
  }



  onMarkerClick = (marker, props, e) => {
    this.setState({
      activeMarker: marker,
      selectedPlace: props,
      showInfo: !this.state.showInfo
    })
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


    // DONE: Map displays all location markers by default, and displays the filtered subset of location markers when a filter is applied.

    // TODO: Clicking a marker displays unique information about a location somewhere on the page (modal, separate div, inside an infoWindow).

    // Displays Map and markers. If filtered, only filtered markers are shown
    return (
      <Map
        aria-label="map"
        role="application"
        google={this.props.google}
        zoom={15}
        initialCenter={center}
        onReady={this.createMarkers}
      >
        {/* Display location information as markers on map */}
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyCxXK6lMDoTo4dHosssdE0SyJ8UtVOtpbU")
})(MapContainer)